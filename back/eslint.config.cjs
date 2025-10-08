module.exports = [
  // ignores
  { ignores: ['dist', 'node_modules'] },

  // règle principale pour .ts / .js
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      // parser TypeScript
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      // remplace "env" : déclarer les globals nécessaires pour Node et l'exécution de tests
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        globalThis: 'readonly',
        console: 'readonly',
        Buffer: 'readonly'
      }
    },
    // plugins
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
      node: require('eslint-plugin-node')
    },
    // règles
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    },
    // environnement sémantique (pas "env") — gérer fichiers de test séparément si besoin
  },

  // configuration pour fichiers de test (optionnel)
  {
    files: ['**/*.{test,spec}.{ts,js}', 'src/tests/**'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      },
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {}
  }
];