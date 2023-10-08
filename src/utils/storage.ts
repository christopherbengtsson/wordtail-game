export const BASE_KEY = 'wordtail-';
export const RECURRING_USER = BASE_KEY + 'recurring-user';

export function isLocalStorageAvailable() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function getLocalStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function setLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return null;
  }
}

export function getIsRecurringUser() {
  if (!isLocalStorageAvailable()) return false;

  const get = getLocalStorage(RECURRING_USER);
  if (get) return get === 'true' ? true : false;
}

export function setIsRecurringUser() {
  if (!isLocalStorageAvailable()) return false;

  const set = setLocalStorage(RECURRING_USER, 'true');
  return set === true ? true : false;
}
