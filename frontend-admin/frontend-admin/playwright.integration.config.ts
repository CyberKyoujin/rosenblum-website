import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Integration E2E tests (real backend)
 */
export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx vite --port 5000 --host',
    url: 'http://localhost:5000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
