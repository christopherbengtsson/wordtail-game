import { defineConfig, devices } from '@playwright/test';
import { getRandomEmail } from './tests/utils/constants';
import { env } from 'node:process';

env.PLAYWRIGHT_EMAIL = getRandomEmail();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  /* Configure projects for major browsers */
  projects: [
    /* Desktop */
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*flow_*.test.ts',
    },
    /* Accessability test */
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*a11y.test.ts',
    },
    // {
    //   name: 'Desktop Firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // {
    //   name: 'Desktop Safari',
    //   use: { ...devices['Desktop Safari'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // /* Tablets */
    // {
    //   name: 'iOS iPad',
    //   use: { ...devices['iPad Pro 11'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // {
    //   name: 'older iOS iPad',
    //   use: { ...devices['iPad (gen 6)'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // {
    //   name: 'Android tablet',
    //   use: { ...devices['Galaxy Tab S4'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // /* Mobile */
    // {
    //   name: 'iOS',
    //   use: { ...devices['iPhone 13 Pro'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // {
    //   name: 'old iOS',
    //   use: { ...devices['iPhone 8'] },
    //   testMatch: '**/flow_*.test.ts',
    // },
    // {
    //   name: 'older Android',
    //   use: { ...devices['Galaxy S9+'] },
    //   testMatch: '**/flow_.test.ts',
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
