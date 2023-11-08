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
  locator.getByRole('button', { name: STRINGS.authLoginCta, exact: true });

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

export const gamesTabActive = (locator: Page) =>
  locator.getByRole('tab', { name: STRINGS.gamesTabActive });

export const gamesTabPending = (locator: Page) =>
  locator.getByRole('tab', { name: STRINGS.gamesTabPending });

export const gamesTabFinished = (locator: Page) =>
  locator.getByRole('tab', { name: STRINGS.gamesTabFinished });

export const createGameModalCloseBtn = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCloseBtn });

export const createGameModalNameInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.createGameModalNameInput);

export const createGameModalMarksInput = (locator: Page) =>
  locator.getByPlaceholder(STRINGS.createGameModalMarksInput);

export const createGameModalPlayersSelect = (locator: Page) =>
  locator.locator('input[id="select-player-input"]');

export const createGameModalCta = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCreateButton });

export const acceptInviteButton = (locator: Page) =>
  locator.getByRole('button', { name: 'Accept', exact: true });

/** Promises/events */
export const waitForPageUrl = (locator: Page) => {
  return locator.waitForURL(/localhost|3000/);
};
