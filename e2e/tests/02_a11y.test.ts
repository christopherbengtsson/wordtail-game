import { test } from '@playwright/test';
import {
  assertCTAView,
  authSubmitButton,
  authToggleRegister,
  createGameButton,
  createGameModalCloseBtn,
  navButtonProfile,
  setup,
  setupAxe,
} from './utils';
import { EMAIL, PASSWORD } from './utils/constants';

test('Application accessibility', async ({ page }) => {
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
  await assertCTAView({ page, locator: createGameModalCloseBtn(page) });

  // Go to profile
  await assertCTAView({ page, locator: navButtonProfile(page) });
});
