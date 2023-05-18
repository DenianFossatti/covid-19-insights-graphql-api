module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 'error',
    indent: 'off',
    'unused-imports/no-unused-imports': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true, allowSeparatedGroups: true }],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/camelcase': ['off', { ignoreDestructuring: true }],
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/named': 'off',
    'import/first': 'warn',
    'import/namespace': ['error', { allowComputed: true }],
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [{ pattern: '**/__generated__/**', group: 'sibling', position: 'before' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-cycle': 'error',
    'import/no-self-import': 'warn',
    'import/extensions': ['off', 'never', { ts: 'never' }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.ios.js', '.android.js'],
      },
      'eslint-import-resolver-typescript': true,
    },
  },
};
