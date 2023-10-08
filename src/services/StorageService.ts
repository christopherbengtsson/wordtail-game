import {
  getLocalStorage,
  isLocalStorageAvailable,
  setLocalStorage,
} from '../utils';

export const BASE_KEY = 'wordtail-';
export const RECURRING_USER = BASE_KEY + 'recurring-user';

export class StorageService {
  private _localStorageAvailable = false;

  constructor() {
    this._localStorageAvailable = isLocalStorageAvailable();
  }

  get localStorageAvailable(): boolean {
    return this._localStorageAvailable;
  }

  recurringUser() {
    if (!this.localStorageAvailable) return false;

    const get = getLocalStorage(RECURRING_USER);
    if (get) return get === 'true' ? true : false;

    const set = setLocalStorage(RECURRING_USER, 'true');
    return set === true ? true : false;
  }
}
