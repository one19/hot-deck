import { fixupConfigRules } from '@eslint/compat';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:react-hooks/recommended'
    )
  ),
  {
    plugins: {
      'react-refresh': reactRefresh,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: './',
      },
    },

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'comma-dangle': 'off',
      'no-confusing-arrow': 'off',
      quotes: [
        2,
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 100,
        },
      ],
      'max-len': [
        'error',
        {
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreUrls: true,
          comments: 100,
          code: 100,
        },
      ],
    },
  },
  { ignores: ['node_modules', 'dist', 'eslint.config.mjs'] },
];
