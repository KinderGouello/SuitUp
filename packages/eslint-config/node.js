module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import-x/recommended',
    'plugin:import-x/typescript',
    'plugin:n/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true, // Auto-detect tsconfig.json
  },
  plugins: ['@typescript-eslint', 'import-x', 'n'],
  settings: {
    'import-x/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.ts', '.js', '.mts', '.mjs'],
      },
    },
    'import-x/extensions': ['.ts', '.js', '.mts', '.mjs'],
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts'],
    },
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo', '*.config.js', '*.config.ts'],
  rules: {
    // ============================================
    // TypeScript - Async Bug Prevention (CRITICAL)
    // ============================================
    '@typescript-eslint/no-floating-promises': 'error', // Catch unhandled promises - CRITICAL for Fastify
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: {
        arguments: false, // Allow async functions as Fastify/web framework handlers
        attributes: false,
      },
    }],
    '@typescript-eslint/await-thenable': 'error', // Only await actual promises
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

    // Gradual 'any' discouragement (warnings not errors)
    // ORM type safety: Prisma/TypeORM client types are too complex for full type-safety
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/restrict-template-expressions': ['error', {
      allowNumber: true,
      allowBoolean: true,
      allowNullish: false,
    }],

    // ============================================
    // TypeScript - Style & Best Practices
    // ============================================
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true, // Allow inline functions
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports', // import { type Foo }
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],

    // ============================================
    // Import/Export Organization (Auto-Fixable)
    // ============================================
    'import-x/order': ['error', {
      'groups': [
        'builtin',  // node:fs, node:path
        'external', // npm packages
        'internal', // @/ aliases
        'parent',   // ../
        'sibling',  // ./
        'index',
        'type',
      ],
      'newlines-between': 'always',
      'alphabetize': {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
    'import-x/no-unresolved': 'error', // Catches broken imports
    'import-x/no-cycle': 'warn',
    'import-x/no-self-import': 'error',
    'import-x/first': 'error',
    'import-x/newline-after-import': 'error',
    'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],

    // ============================================
    // Node.js Best Practices
    // ============================================
    'n/no-unsupported-features/es-syntax': ['error', {
      version: '>=18.0.0',
      ignores: ['modules'], // ESM is supported
    }],
    'n/no-unsupported-features/node-builtins': ['error', {
      version: '>=18.0.0',
    }],
    'n/no-missing-import': 'off', // import-x handles this
    'n/no-missing-require': 'off', // Using ESM
    'n/no-unpublished-import': 'off', // Turbo handles this
    'n/no-unpublished-require': 'off',
    'n/file-extension-in-import': 'off', // TypeScript handles module resolution
    'n/prefer-global/buffer': ['error', 'never'], // import { Buffer } from 'node:buffer'
    'n/prefer-global/console': ['error', 'always'],
    'n/prefer-global/process': ['error', 'never'], // import process from 'node:process'
    'n/prefer-node-protocol': 'error', // node:fs not fs

    // ============================================
    // Code Quality
    // ============================================
    'no-console': 'off', // Valid for backend/CLI contexts (APIs, scripts, etc.)
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'curly': ['error', 'all'],
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // ============================================
    // Complexity (Warnings to Encourage Refactoring)
    // ============================================
    'max-lines-per-function': ['warn', {
      max: 150,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-depth': ['warn', 4],
    'complexity': ['warn', 15],
  },
  overrides: [
    // ============================================
    // Test Files - Relaxed Rules
    // ============================================
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
      rules: {
        // Relax for tests
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'max-lines-per-function': 'off',
        'max-depth': 'off',
        'complexity': 'off',
      },
    },
  ],
};
