import js from '@eslint/js';
import typescript from 'typescript-eslint';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

const typescriptRules = {
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
    },
  ],
    'no-unused-vars': 'off',
  '@typescript-eslint/explicit-member-accessibility': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
};

const angularDirectiveSelector = [
  'error',
  {
    type: 'attribute',
    prefix: 'app',
    style: 'camelCase',
  },
];

const angularComponentSelector = [
  'error',
  {
    type: 'element',
    prefix: 'app',
    style: 'kebab-case',
  },
];

const commonRules = {
  semi: ['error', 'always'],
  quotes: ['error', 'single'],
  indent: ['error', 2],
  'prefer-const': 'error',
  eqeqeq: ['error', 'always'],
};

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.url.split('/').slice(0, -1).join('/').replace('file:', ''),
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        globalThis: 'readonly',
        self: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        queueMicrotask: 'readonly',
        crypto: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript.plugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended[0].rules,
      ...typescript.configs.stylistic[0].rules,
      ...angularPlugin.configs.recommended.rules,
      '@angular-eslint/directive-selector': angularDirectiveSelector,
      '@angular-eslint/component-selector': angularComponentSelector,
      ...typescriptRules,
      ...commonRules,
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.url.split('/').slice(0, -1).join('/').replace('file:', ''),
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        globalThis: 'readonly',
        self: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        queueMicrotask: 'readonly',
        crypto: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript.plugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended[0].rules,
      ...typescript.configs.stylistic[0].rules,
      ...angularPlugin.configs.recommended.rules,
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
      ...typescriptRules,
      ...commonRules,
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.angular/**'],
  },
];
