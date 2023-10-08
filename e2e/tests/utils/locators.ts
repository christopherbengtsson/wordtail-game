import { Page } from '@playwright/test';
import { STRINGS } from './constants';

export const authSubmitButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.authCta });

export const createGameButton = (locator: Page) =>
  locator.getByRole('button', { name: STRINGS.createGameModalCta });
  
export const createGameHeading = (locator: Page) =>
  locator.getByRole('heading', { name: STRINGS.createGameModalHeading });

/** Promises/events */
export const waitForPageUrl = (locator: Page) => {
  return locator.waitForURL(/localhost|3000/);
};