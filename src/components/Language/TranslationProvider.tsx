import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  LanguageContext,
  LanguageSwitcherContext,
} from './LanguageContext';
import { getStoredLanguage } from './sessionStorage';
import { fetchLanguageMap, LanguageContainer } from './translate';

const storedLanguage = getStoredLanguage();
if (storedLanguage !== DEFAULT_LANGUAGE) {
  fetchLanguageMap(storedLanguage);
} else {
  LanguageContainer.loaded = true;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setLanguage] = useState(storedLanguage);
  const [loaded, setLoaded] = useState(LanguageContainer.loaded);

  const changeLanguage = useCallback((lang: string) => {
    fetchLanguageMap(lang).then(() => {
      setLanguage(lang);
    });
  }, []);

  useEffect(() => {
    if (LanguageContainer.loaded) {
      return;
    }
    fetchLanguageMap(storedLanguage).then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={currentLanguage}>
      <LanguageSwitcherContext.Provider value={changeLanguage}>
        {children}
      </LanguageSwitcherContext.Provider>
    </LanguageContext.Provider>
  );
}
