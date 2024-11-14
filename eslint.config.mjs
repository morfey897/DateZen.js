import globals from 'globals';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import checkFilePlugin from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import eslintRecommended from '@eslint/js';

export default [
  eslintRecommended.configs.recommended,
  {
    ignores: [
      'dist/*',
      'dist/**/*',
      'node_modules/*',
      'node_modules/**/*',
      'eslint.config.{js,mjs,cjs}',
      'tsup.config.{ts,js,mjs,cjs}',
      'jest.config.{js,mjs,cjs}',
    ],
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'check-file': checkFilePlugin,
      '@typescript-eslint': tsEslint,
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      // TypeScript rules
      '@typescript-eslint/no-redeclare': ['error'],
      // Prettier
      'prettier/prettier': 'error',

      // Check file
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.class.{js,ts}': 'PASCAL_CASE',
          '**/*.{json,md}': 'KEBAB_CASE',
          '**/!(*.class).{js,ts}': 'CAMEL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      'check-file/folder-naming-convention': [
        'error',
        { 'src/**': 'KEBAB_CASE' },
      ],

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',

      // JS/TS rules
      'no-nested-ternary': 'error',
      'no-param-reassign': 'error',
      'no-restricted-imports': 'error',
      'no-else-return': ['error', { allowElseIf: true }],
      'no-redeclare': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
  },
];