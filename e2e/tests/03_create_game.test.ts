import { test } from '@playwright/test';
import {
  acceptInviteButton,
  createGameButton,
  createGameModalCta,
  createGameModalMarksInput,
  createGameModalNameInput,
  createGameModalPlayersSelect,
  gamesTabPending,
  getCreds,
  setup,
} from './utils';

const mobileConfig = {
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
  screen: {
    width: 390,
    height: 844,
  },
  viewport: {
    width: 390,
    height: 664,
  },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

const { email: desktopEmail } = getCreds();

test('Create Game flow', async ({ browser }) => {
  const desktopContext = await browser.newContext({
    storageState: 'e2e/.auth/E2E_1.json',
  });
  const mobileContext = await browser.newContext({
    ...mobileConfig,
    storageState: 'e2e/.auth/E2E_2.json',
  });

  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();

  // Go to website
  await Promise.all([
    setup({ page: desktopPage }),
    setup({ page: mobilePage }),
  ]);

  // Create a new game on mobile
  await createGameButton(mobilePage).click();
  await createGameModalNameInput(mobilePage).fill('E2E TEST GAME');
  await createGameModalMarksInput(mobilePage).fill('1');

  const desktopUsername = desktopEmail.substring(0, desktopEmail.indexOf('@'));
  await createGameModalPlayersSelect(mobilePage).fill(desktopUsername);
  await mobilePage.waitForSelector(
    `#react-select-3-listbox div:text('${desktopUsername}')`,
  );
  await mobilePage.keyboard.press('Enter');
  await createGameModalCta(mobilePage).click();

  // Accept invite on desktop
  await gamesTabPending(desktopPage).click();
  await acceptInviteButton(desktopPage).click();
});
