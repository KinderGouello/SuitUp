import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/**/*.ts',
      ],
      thresholds: {
        lines: 80, // Require 80% line coverage
        functions: 80, // Require 80% function coverage
        branches: 75, // Require 75% branch coverage
        statements: 80, // Require 80% statement coverage
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    poolOptions: {
      threads: {
        singleThread: true, // Run tests sequentially for database tests
      },
    },
  },
});
