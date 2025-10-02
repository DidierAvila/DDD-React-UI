// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'out/**',
      'node_modules/**',
      '.env*',
      '*.log',
      'coverage/**',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'public/**',
      '*.tsbuildinfo',
      'swagger.json',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    extends: [eslintPluginPrettierRecommended],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  }
);
