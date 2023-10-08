import ip from 'ip';

export const HOST = ip.address();

export const URL = {
  LOCAL: `http://${HOST}:3000`,
  STG: '',
};

export const STRINGS = {
  authCta: 'Submit',
  createGameModalCta: 'CREATE NEW GAME',
  createGameModalHeading: 'Create new game',
};
