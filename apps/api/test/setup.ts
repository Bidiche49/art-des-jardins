import 'reflect-metadata';

// Increase timeout for async operations
jest.setTimeout(30000);

// Mock console.error to keep test output clean (optional)
// Uncomment if you want to suppress error logs during tests
// jest.spyOn(console, 'error').mockImplementation(() => {});

// Global test utilities
beforeAll(async () => {
  // Setup code that runs once before all tests
});

afterAll(async () => {
  // Cleanup code that runs once after all tests
});
