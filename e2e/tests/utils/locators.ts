import { Page } from '@playwright/test';
import { STRINGS } from './constants';

export const authToggleRegister = (locator: Page) =>
  locator.getByText(STRINGS.authToggleToLogin);

export const authToggleLogin = (locator: Page) =>
  locator.getByText(STRINGS.authToggleToRegister);

export const authEmailInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.authEmailInput);

export const authPasswordInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.authPasswordInput, { exact: true });

export const authPasswordConfirmInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.authPasswordConfirmInput, { exact: true });

export const authLoginButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.authLoginCta });

export const authRegisterButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.authRegisterCta, exact: true });

export const authLogoutButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.authLogoutCta });

export const navButtonGames = (locator: Page) =>
  locator.getByRole('link', { name: STRINGS.gamesAnchorLink });

export const navButtonProfile = (locator: Page) =>
  locator.getByRole('link', { name: STRINGS.profileAnchorLink });

export const createGameButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCta });

export const createGameModalCloseBtn = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCloseBtn });

export const createGameModalNameInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.createGameModalNameInput);

export const createGameModalMarksInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.createGameModalMarksInput);

export const createGameModalPlayersSelect = (locator: Page) =>
  locator.getByLabel(STRINGS.createGameModalPlayersSelect);

/** Promises/events */
export const waitForPageUrl = (locator: Page) => {
  return locator.waitForURL(/localhost|3000/);
};
