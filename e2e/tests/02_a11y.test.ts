import { test } from '@playwright/test';
import {
  assertCTAView,
  authSubmitButton,
  authToggleRegister,
  createGameButton,
  createGameHeading,
  setup,
  setupAxe,
} from './utils';
import { EMAIL, PASSWORD } from './utils/constants';

test('Desktop accessibility', async ({ page }) => {
  await setup({ page });
  await setupAxe(page);

  // Toggle to login
  await authToggleRegister(page).click();

  // Fill in form
  await page.getByPlaceholder('Email').fill(EMAIL);
  await page.getByPlaceholder('Password').fill(PASSWORD);

  // Login
  await assertCTAView({ page, locator: authSubmitButton(page) });

  // Landing page
  await assertCTAView({ page, locator: createGameButton(page) });

  // Create game modal
  await assertCTAView({ page, locator: createGameHeading(page) });
});
