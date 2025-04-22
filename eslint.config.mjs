import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{ts,mjs}'],
    plugins: { js, 'simple-import-sort': simpleImportSort },
    extends: ['js/recommended'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  { files: ['**/*.{ts}'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  globalIgnores([
    'node_modules/**/*',
    'build/**/*',
    'generated/**/*',
    'coverage/**/*',
  ]),
])
