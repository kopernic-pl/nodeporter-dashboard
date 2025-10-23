import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'prettier'],
    plugins: ['import']
  }),
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: Object.fromEntries(
        Object.entries({
          ...globals.browser,
          ...globals.node,
        }).map(([key, value]) => [key.trim(), value])
      ),
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'off',
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', 'jest.setup.js'],
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries({
          ...globals.jest,
          describe: 'readonly',
          it: 'readonly',
          expect: 'readonly',
          beforeEach: 'readonly',
        }).map(([key, value]) => [key.trim(), value])
      ),
    },
  },
]

export default eslintConfig.concat([{
  ignores: [
    '**/node_modules/**',
    '**/.next/**',
  ],
}])