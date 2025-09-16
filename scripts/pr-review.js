// Lightweight PR rule-based reviewer
// Node 18+ (uses global fetch)

const fs = require('fs');
const path = require('path');

function log(...args) { console.log('[pr-review]', ...args); }

async function run() {
  try {
    const eventPath = process.env.GITHUB_EVENT_PATH;
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;

    if (!eventPath || !token || !repo) {
      throw new Error('Missing required environment variables. Ensure GITHUB_EVENT_PATH, GITHUB_TOKEN and GITHUB_REPOSITORY are set.');
    }

    const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    const pr = event.pull_request;
    if (!pr) {
      log('No pull_request found in event payload. Exiting.');
      return;
    }

    const [owner, repoName] = repo.split('/');
    const prNumber = pr.number;
    const headRef = pr.head.ref;

    const gh = (url, opts = {}) =>
      fetch(url, Object.assign({ headers: { Authorization: `token ${token}`, 'User-Agent': 'pr-review-action' } }, opts));

    // Get list of changed files on the PR
    const filesUrl = `https://api.github.com/repos/${owner}/${repoName}/pulls/${prNumber}/files`;
    const filesRes = await gh(filesUrl);
    if (!filesRes.ok) throw new Error(`Failed to fetch PR files: ${filesRes.status} ${filesRes.statusText}`);
    const files = await filesRes.json();

    const filenames = files.map(f => f.filename);

    // Helper to fetch file content at head ref
    async function fetchFile(pathRel) {
      const contentsUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${encodeURIComponent(pathRel)}?ref=${encodeURIComponent(pr.head.ref)}`;
      const res = await gh(contentsUrl);
      if (!res.ok) return null;
      const json = await res.json();
      if (!json.content) return null;
      const buff = Buffer.from(json.content, json.encoding || 'base64');
      return buff.toString('utf8');
    }

    // Basic checks
    const addedEntities = filenames.filter(n => n.startsWith('back/src/entities/') && n.endsWith('.ts'));
    const changedTsconfig = filenames.includes('back/tsconfig.json') || filenames.includes('back/tsconfig.json');
    const changedDatabaseService = filenames.includes('back/src/services/database.service.ts');

    let dbServiceContent = null;
    if (changedDatabaseService) {
      dbServiceContent = await fetchFile('back/src/services/database.service.ts');
    } else {
      // also try to fetch file if it exists on head (in case it wasn't changed but we still want to inspect)
      try { dbServiceContent = await fetchFile('back/src/services/database.service.ts'); } catch(e){ dbServiceContent = null; }
    }

    let tsconfigContent = null;
    try { tsconfigContent = await fetchFile('back/tsconfig.json'); } catch(e){ tsconfigContent = null; }

    // Compose findings
    const findings = [];

    if (addedEntities.length > 0) {
      findings.push({ level: 'info', text: `Detected ${addedEntities.length} entity files added/changed under back/src/entities: \n- ${addedEntities.join('\n- ')}` });
    }

    if (dbServiceContent) {
      if (dbServiceContent.includes('"src/entities/*.entity.ts"') || dbServiceContent.includes("'src/entities/*.entity.ts'")) {
        findings.push({ level: 'warning', text: 'DatabaseService uses entities: ["src/entities/*.entity.ts"]. This will work in dev but fail when running compiled JS in production. Consider using a __dirname-based path or include .js globs for the built output (ex: path.join(__dirname, "../entities/*.entity.{ts,js}")) or use process.env to switch.' });
      } else if (dbServiceContent.includes('entities:')) {
        findings.push({ level: 'info', text: 'DatabaseService entities config modified or present. Ensure runtime paths are correct for both dev (ts) and prod (js).' });
      }
    } else {
      findings.push({ level: 'info', text: 'Could not find back/src/services/database.service.ts content at PR head to analyze. If you rely on TypeORM decorators, ensure tsconfig has experimentalDecorators and emitDecoratorMetadata enabled.' });
    }

    if (tsconfigContent) {
      const hasExp = /"experimentalDecorators"\s*:\s*true/.test(tsconfigContent);
      const hasEmit = /"emitDecoratorMetadata"\s*:\s*true/.test(tsconfigContent);
      if (!hasExp || !hasEmit) {
        findings.push({ level: 'warning', text: `back/tsconfig.json is missing ${!hasExp ? 'experimentalDecorators' : ''}${(!hasExp && !hasEmit)? ' and ': ''}${!hasEmit ? 'emitDecoratorMetadata' : ''}. These are required for TypeORM decorators to work.` });
      } else {
        findings.push({ level: 'info', text: 'back/tsconfig.json contains experimentalDecorators and emitDecoratorMetadata.' });
      }
    }

    // Check for possible eager/cascade usage in entity files
    const entityFiles = filenames.filter(n => n.startsWith('back/src/entities/') && n.endsWith('.ts'));
    for (const ef of entityFiles) {
      const content = await fetchFile(ef);
      if (!content) continue;
      if (content.includes("{eager: true}" ) || content.includes('eager: true')) {
        findings.push({ level: 'warning', text: `${ef} contains eager: true on a relation. Eager loading can cause performance issues and unexpected large payloads. Consider using explicit relation loading.` });
      }
      if (content.includes('cascade: true') || content.includes('cascade: [')) {
        findings.push({ level: 'warning', text: `${ef} uses cascade on relations. Ensure this is intentional, as cascading deletes/updates can have side effects.` });
      }
      if (ef.endsWith('ingredient.entity.ts') && content.includes('@Column({ unique: true')) {
        findings.push({ level: 'info', text: 'ingredient.entity.ts defines a unique constraint on name — good to prevent duplicate ingredients.' });
      }
    }

    // If PR title mentions CRUD but no controllers/services changed, warn
    const title = pr.title || '';
    if (/\bCRUD\b/i.test(title) || /recipes|ingredients/i.test(title)) {
      const hasControllers = filenames.some(n => n.includes('controllers') || n.includes('services') || n.includes('routes'));
      if (!hasControllers) {
        findings.push({ level: 'info', text: `PR title mentions CRUD but no controllers/services/routes were changed. This PR appears focused on models/entities only. If CRUD endpoints were intended, consider adding controllers/services and DTO validations.` });
      }
    }

    // Common suggestions
    findings.push({ level: 'info', text: 'Recommendations: add DTOs and validation, add basic tests (unit/integration), and use migrations for production schema changes.' });

    // Build comment
    const lines = [];
    lines.push('## Automated PR Review — Rule-based checks');
    lines.push('This comment was generated automatically to highlight potential issues and suggestions related to entities, TypeORM configuration, and PR scope.');
    lines.push('');

    lines.push('### Changed files');
    lines.push('');
    filenames.forEach(f => lines.push(`- \`${f}\``));
    lines.push('');

    lines.push('### Findings');
    lines.push('');
    if (findings.length === 0) {
      lines.push('- No issues found by the automated checks.');
    } else {
      findings.forEach((f, idx) => {
        const emoji = f.level === 'warning' ? '⚠️' : 'ℹ️';
        lines.push(`${emoji} **${f.level.toUpperCase()}**: ${f.text}`);
      });
    }

    lines.push('');
    lines.push('### Checklist / Next steps');
    lines.push('');
    lines.push('- [ ] Ensure DatabaseService entity globs work in production (use __dirname or include .js files).');
    lines.push('- [ ] Add DTOs and validations for API inputs.');
    lines.push('- [ ] Add migration files if deploying to production instead of relying on synchronize.');
    lines.push('- [ ] Add tests for entity behavior and CRUD endpoints.');

    const body = lines.join('\n');

    // Post comment
    const commentsUrl = `https://api.github.com/repos/${owner}/${repoName}/issues/${prNumber}/comments`;
    const postRes = await gh(commentsUrl, { method: 'POST', body: JSON.stringify({ body }) });
    if (!postRes.ok) {
      const txt = await postRes.text();
      throw new Error(`Failed to post comment: ${postRes.status} ${postRes.statusText} - ${txt}`);
    }

    log('Posted automated review comment to PR', prNumber);

  } catch (err) {
    console.error('[pr-review] Error:', err);
    process.exit(1);
  }
}

run();