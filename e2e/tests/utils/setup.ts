import { Page } from '@playwright/test';
import { URL } from './constants';

export type DeviceCategory = 'desktop' | 'mobile';

export function getUrl() {
  if (process.env.E2E_CI !== '1') {
    return URL.LOCAL;
  }

  return URL.STG;
}

export const setup = async ({ page }: { page: Page }) => {
  const config = {
    url: getUrl(),
  };

  await page.goto(config.url, { waitUntil: 'networkidle' });
};
