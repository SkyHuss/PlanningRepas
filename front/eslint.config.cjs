module.exports = [
  // règles d'ignore globales
  { ignores: ['dist', 'node_modules', 'build'] },

  // configuration pour fichiers JS/TS/JSX/TSX
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      // utiliser le module parser, pas son chemin
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      prettier: require('eslint-plugin-prettier')
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    },
    settings: { react: { version: 'detect' } }
  }
];