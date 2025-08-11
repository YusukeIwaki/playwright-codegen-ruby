import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000, // 10秒のタイムアウト（E2Eテストのため）
    hookTimeout: 10000, // フックのタイムアウト
  },
});
