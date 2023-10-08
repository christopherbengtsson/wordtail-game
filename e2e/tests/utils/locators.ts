import { Page } from '@playwright/test';
import { STRINGS } from './constants';

export const authToggleRegister = (locator: Page) =>
  locator.getByText(STRINGS.authToggleToLogin);

export const authToggleLogin = (locator: Page) =>
  locator.getByText(STRINGS.authToggleToRegister);

export const authSubmitButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.authCta });

export const navButtonGames = (locator: Page) =>
  locator.getByRole('link', { name: STRINGS.gamesAnchorLink });

export const navButtonProfile = (locator: Page) =>
  locator.getByRole('link', { name: STRINGS.profileAnchorLink });

export const createGameButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCta });

export const createGameModalCloseBtn = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCloseBtn });

/** Promises/events */
export const waitForPageUrl = (locator: Page) => {
  return locator.waitForURL(/localhost|3000/);
};
