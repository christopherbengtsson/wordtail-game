import { DEFAULT_LANGUAGE, SESSION_LANGUAGE_KEY } from './LanguageContext';

export function getStoredLanguage() {
  try {
    return sessionStorage.getItem(SESSION_LANGUAGE_KEY) ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
export function setStoredLanguage(lang: string) {
  try {
    sessionStorage.setItem(SESSION_LANGUAGE_KEY, lang);
  } catch {
    // nothing to do here
  }
}
