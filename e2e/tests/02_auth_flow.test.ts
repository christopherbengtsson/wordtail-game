import { test, expect } from '@playwright/test';
import {
  authEmailInput,
  authLogoutButton,
  authPasswordConfirmInput,
  authPasswordInput,
  authRegisterButton,
  authToggleLogin,
  navButtonProfile,
  setup,
} from './utils';
import { EMAIL, PASSWORD, STRINGS } from './utils/constants';

test('Auth form validations and errors', async ({ page }) => {
  await setup({ page });

  // Go to profile and sign out
  await navButtonProfile(page).click();
  await authLogoutButton(page).click();

  // Toggle to register
  await authToggleLogin(page).click();
  // Try submit
  await authRegisterButton(page).click();

  // Expect error descriptions
  expect(page.getByText(STRINGS.generalInputError)).toBeTruthy();
  expect(page.getByText(STRINGS.generalInputError)).toBeTruthy();
  expect(page.getByText(STRINGS.generalInputError)).toBeTruthy();

  // Fill in email
  await authEmailInput(page).fill(EMAIL);

  const passwordPartOne = PASSWORD.substring(0, 4);

  // Fill in too short password
  await authPasswordInput(page).fill(passwordPartOne);
  // Fill in different password
  await authPasswordConfirmInput(page).fill(passwordPartOne + 1);

  // Try submit
  await authRegisterButton(page).click();
  expect(page.getByText(STRINGS.authEmailError)).toBeTruthy();
  expect(page.getByText(STRINGS.authPasswordConfirmError)).toBeTruthy();

  await authRegisterButton(page).click();

  // Fill in rest of password
  await authPasswordInput(page).fill(PASSWORD);
  await authPasswordConfirmInput(page).fill(PASSWORD);

  // Submit
  await authRegisterButton(page).click();
  expect(page.getByText('User already registered')).toBeTruthy();
});
