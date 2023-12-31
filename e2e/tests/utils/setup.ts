import { Page } from '@playwright/test';
import { URL } from './constants';

export type DeviceCategory = 'desktop' | 'mobile';

export function getUrl() {
  if (process.env.E2E_CI !== '1') {
    return URL.LOCAL;
  }

  return URL.STG;
}

export function getCreds() {
  const email = process.env.E2E_1_EMAIL;
  const password = process.env.E2E_1_PWD;
  const email2 = process.env.E2E_2_EMAIL;
  const password2 = process.env.E2E_2_PWD;

  if (!email || !email2) {
    throw new Error('No E2E emails found');
  }
  return { email, password, email2, password2 };
}

export const setup = async ({ page }: { page: Page }) => {
  const config = {
    url: getUrl(),
  };

  await page.goto(config.url, { waitUntil: 'networkidle' });
};
