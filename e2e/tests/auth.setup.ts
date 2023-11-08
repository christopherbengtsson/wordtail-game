import { test as setupAuth, expect } from '@playwright/test';
import {
  authEmailInput,
  authPasswordConfirmInput,
  authPasswordInput,
  authLoginButton,
  authToggleRegister,
  createGameButton,
  getCreds,
  setup,
  authRegisterButton,
} from './utils';

const e2e1File = 'e2e/.auth/E2E_1.json';
const e2e2File = 'e2e/.auth/E2E_2.json';

const credentials = getCreds();

const IS_LOCAL = !process.env.E2E_CI;

setupAuth('authenticate test user 1', async ({ page }) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw 'No E2E_1 credentials!';
  }

  await setup({ page });

  // Register new E2E user if local
  if (!IS_LOCAL) {
    await authToggleRegister(page).click();
  }

  await authEmailInput(page).fill(email);
  await authPasswordInput(page).fill(password);

  if (IS_LOCAL) {
    await authPasswordConfirmInput(page).fill(password);
    await authRegisterButton(page).click();
  } else {
    await authLoginButton(page).click();
  }

  await expect(createGameButton(page)).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: e2e1File });
});

setupAuth('authenticate test user 2', async ({ page }) => {
  const { email2: email, password2: password } = credentials;

  if (!email || !password) {
    throw 'No E2E_2 credentials!';
  }

  await setup({ page });

  if (!IS_LOCAL) {
    await authToggleRegister(page).click();
  }

  await authEmailInput(page).fill(email);
  await authPasswordInput(page).fill(password);

  if (IS_LOCAL) {
    await authPasswordConfirmInput(page).fill(password);
    await authRegisterButton(page).click();
  } else {
    await authLoginButton(page).click();
  }

  await expect(createGameButton(page)).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: e2e2File });
});
