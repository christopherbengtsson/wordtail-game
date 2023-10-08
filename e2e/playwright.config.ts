import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    /* Accessability test */
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/a11y.test.ts',
    },
    /* Desktop */
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/desktop*.test.ts',
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/desktop*.test.ts',
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/desktop*.test.ts',
    },
    /* Tablets */
    {
      name: 'iOS iPad',
      use: { ...devices['iPad Pro 11'] },
      testMatch: '**/desktop*.test.ts',
    },
    {
      name: 'older iOS iPad',
      use: { ...devices['iPad (gen 6)'] },
      testMatch: '**/desktop*.test.ts',
    },
    {
      name: 'Android tablet',
      use: { ...devices['Galaxy Tab S4'] },
      testMatch: '**/desktop*.test.ts',
    },
    /* Mobile */
    {
      name: 'iOS',
      use: { ...devices['iPhone 13 Pro'] },
      testMatch: '**/mobile*.test.ts',
    },
    {
      name: 'old iOS',
      use: { ...devices['iPhone 8'] },
      testMatch: '**/mobile*.test.ts',
    },
    {
      name: 'older Android',
      use: { ...devices['Galaxy S9+'] },
      testMatch: '**/mobile*.test.ts',
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
