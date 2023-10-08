import { Locator, Page, expect } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';
import type { AxeOptions } from 'axe-playwright/dist/types';
interface CTAViewProps {
  page: Page;
  locator: Locator;
  a11yContext?: string;
}

export const axeOptions: AxeOptions = {
  detailedReport: true,
  detailedReportOptions: {
    html: true,
  },
};

export const assertCTAView = async ({ page, locator, a11yContext }: CTAViewProps) => {
  await expect(locator).toBeVisible();
  await checkA11y(page, a11yContext, axeOptions);
  await locator.click();
};

export const setupAxe = async (page: Page) => {
  await injectAxe(page);
};
