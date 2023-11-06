import { test, expect } from '@playwright/test';
import { authLoginButton, setup } from './utils';
import { EMAIL, PASSWORD } from './utils/constants';

test('Auth form validations and errors', async ({ page }) => {
  await setup({ page });

  // Try submit
  await authLoginButton(page).click();

  // Expect error descriptions
  expect(page.getByText('Email is required')).toBeTruthy();
  expect(page.getByText('Password is required')).toBeTruthy();
  expect(page.getByText('Confirmation password is required')).toBeTruthy();

  // Fill in email
  await page.getByPlaceholder('Email').fill(EMAIL);

  const passwordPartOne = PASSWORD.substring(0, 4);

  // Fill in too short password
  await page
    .getByPlaceholder('Password', { exact: true })
    .fill(passwordPartOne);
  // Fill in different password
  await page
    .getByPlaceholder('Confirm password', { exact: true })
    .fill(passwordPartOne + 1);

  // Try submit
  await authLoginButton(page).click();
  expect(
    page.getByText('Password must to be at least 6 characters'),
  ).toBeTruthy();
  expect(page.getByText("Passwords don't match")).toBeTruthy();

  await authLoginButton(page).click();

  // Fill in rest of password
  await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD);
  await page.getByPlaceholder('Confirm password').fill(PASSWORD);

  // Submit
  await authLoginButton(page).click();
  expect(page.getByText('User already registered')).toBeTruthy();
});
