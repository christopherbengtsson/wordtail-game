import { test } from '@playwright/test';
import {
  assertCTAView,
  authSubmitButton,
  createGameButton,
  createGameHeading,
  setup,
  setupAxe,
} from './utils';

test('Desktop accessibility', async ({ page }) => {
  await setup({ page });
  await setupAxe(page);

  // Authentication Form
  await page
    .getByPlaceholder('Email')
    .fill('bengtsson.christopher@hotmail.com');
  await page.getByPlaceholder('Password').fill('123456789');
  await assertCTAView({ page, locator: authSubmitButton(page) });

  // Landing page
  await assertCTAView({ page, locator: createGameButton(page) });

  // Create game modal
  await assertCTAView({ page, locator: createGameHeading(page) });
});
