import { createContext } from 'react';

export const DEFAULT_LANGUAGE = 'sv-SE';
export const SESSION_LANGUAGE_KEY = 'SESSSION_LANGUAGE';

export const LanguageContext = createContext(DEFAULT_LANGUAGE);
export const LanguageSwitcherContext = createContext((_lang: string) => {});
