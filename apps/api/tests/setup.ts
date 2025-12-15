import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test setup
beforeAll(async () => {
  // Setup runs once before all tests
  // Example: Initialize test database connection
  console.log('🧪 Test suite starting...');
});

afterAll(async () => {
  // Cleanup runs once after all tests
  // Example: Close database connections
  console.log('✅ Test suite completed');
});

beforeEach(async () => {
  // Runs before each test
  // Example: Reset database state, clear mocks
});

afterEach(async () => {
  // Runs after each test
  // Example: Cleanup test data
});

// Make environment variables available in tests
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent'; // Silence logs during tests
