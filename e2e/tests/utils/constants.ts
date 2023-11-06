import ip from 'ip';
import { translate } from '../../../src/components/Language/translate';

export const EMAIL = 'dummy1@test.com';
export const EMAIL2 = 'dummy2@test.com';
export const PASSWORD = '123456789';
export const HOST = ip.address();

export const URL = {
  LOCAL: `http://${HOST}:3000`,
  STG: 'https://glittery-kleicha-cdbf63.netlify.app/login',
};

export const STRINGS = {
  generalInputError: translate('general.input.required'),
  authLoginCta: translate('auth.cta.login'),
  authRegisterCta: translate('auth.cta.register'),
  authLogoutCta: translate('auth.cta.logout'),
  authToggleToLogin: translate('auth.toggle.login'),
  authToggleToRegister: translate('auth.toggle.register'),
  authEmailInput: translate('auth.email.label'),
  authEmailError: translate('auth.email.invalid'),
  authPasswordInput: translate('auth.password.label'),
  authPasswordError: translate('auth.password.invalid'),
  authPasswordConfirmInput: translate('auth.password.confirm.label'),
  authPasswordConfirmError: translate('auth.password.confirm.invalid'),
  createGameModalCta: translate('games.cta.create'),
  createGameModalCloseBtn: 'Close',
  createGameModalNameInput: translate('modal.create.game.name.label'),
  createGameModalMarksInput: translate('modal.create.game.marks.label'),
  createGameModalPlayersSelect: translate('modal.create.game.players.label'),
  gamesAnchorLink: translate('nav.header.games'),
  profileAnchorLink: translate('nav.header.profil'),
};
