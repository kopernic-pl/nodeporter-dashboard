import globals from 'globals';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

const eslintConfig = [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: Object.fromEntries(
        Object.entries({
          ...globals.browser,
          ...globals.node,
        }).map(([key, value]) => [key.trim(), value])
      ),
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // Standard, reasonable rules for OSS project
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
      'no-undef': 'off', // Allow global variables
      
      // React Hooks rules (relaxed for OSS project)
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'warn',
    },
    settings: {
      react: {
        version: '19', // Explicitly set React version to avoid auto-detection issues
      },
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', 'jest.setup.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/coverage/**'],
  },
];

export default eslintConfig;
