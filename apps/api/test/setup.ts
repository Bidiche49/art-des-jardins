import 'reflect-metadata';
import { setupTestDb, teardownTestDb, cleanTestDb, seedTestDb } from './helpers/test-db';

// Increase timeout for async operations
jest.setTimeout(30000);

// Use real database if USE_REAL_DB is set
const useRealDb = process.env.USE_REAL_DB === 'true';

// Global test utilities
beforeAll(async () => {
  if (useRealDb) {
    console.log('Setting up test database...');
    await setupTestDb();
    await cleanTestDb();
    await seedTestDb();
    console.log('Test database ready');
  }
});

afterAll(async () => {
  if (useRealDb) {
    await cleanTestDb();
    await teardownTestDb();
    console.log('Test database cleaned up');
  }
});

// Clean between test suites if using real DB
afterEach(async () => {
  if (useRealDb && process.env.CLEAN_BETWEEN_TESTS === 'true') {
    await cleanTestDb();
    await seedTestDb();
  }
});
