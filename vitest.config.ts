import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000, // 10 second timeout (for E2E tests)
    hookTimeout: 10000, // Hook timeout
  },
});
