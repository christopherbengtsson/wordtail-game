import ip from 'ip';

export const getRandomEmail = () => `playwright${Math.random()}@test.com`;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const EMAIL = process.env.PLAYWRIGHT_EMAIL!;
export const PASSWORD = '123456789';
export const HOST = ip.address();

export const URL = {
  LOCAL: `http://${HOST}:3000`,
  STG: '',
};

export const STRINGS = {
  authCta: 'Submit',
  authToggleToLogin: 'I already have an account',
  authToggleToRegister: "I don't have an account",
  createGameModalCta: 'CREATE NEW GAME',
  createGameModalHeading: 'Create new game',
};
