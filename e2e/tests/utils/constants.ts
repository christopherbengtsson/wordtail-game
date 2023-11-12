import ip from 'ip';
import { translate } from '../../../src/components/Language/translate';

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
  gamesTabActive: translate('games.tabs.active'),
  gamesTabPending: translate('games.tabs.pending'),
  gamesTabFinished: translate('games.tabs.finished'),
  createGameModalCloseBtn: 'Close',
  createGameModalNameInput: translate('modal.create.game.name.label'),
  createGameModalMarksInput: translate('modal.create.game.marks.label'),
  createGameModalPlayersSelect: translate('modal.create.game.players.label'),
  createGameModalCreateButton: translate('modal.create.game.cta'),
  gamesAnchorLink: translate('nav.header.games'),
  profileAnchorLink: translate('nav.header.profil'),
};
