import { test } from '@playwright/test';
import {
  assertCTAView,
  createGameButton,
  createGameModalCloseBtn,
  createGameModalMarksInput,
  createGameModalNameInput,
  createGameModalPlayersSelect,
  navButtonProfile,
  setup,
  setupAxe,
} from './utils';

test('Application happy game flow + accessibility', async ({ page }) => {
  await setup({ page });
  await setupAxe(page);

  // Landing page
  await assertCTAView({ page, locator: createGameButton(page) });

  // Create game modal
  await createGameModalNameInput(page).fill('Test game 1');
  await createGameModalMarksInput(page).fill('1');
  await createGameModalPlayersSelect(page).fill('E2E_2');
  await assertCTAView({ page, locator: createGameModalCloseBtn(page) });

  // Go to profile
  await assertCTAView({ page, locator: navButtonProfile(page) });
});
