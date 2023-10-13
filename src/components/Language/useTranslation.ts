import { useContext } from 'react';
import { LanguageContext, LanguageSwitcherContext } from './LanguageContext';
import { setStoredLanguage } from './sessionStorage';
import { SwedishTranslations, translate, TranslationKey } from './translate';

export type TranslationOptions = {
  values?: string[] | Record<string, string>;
};

export function useTranslation() {
  // Rerender when language changes
  useContext(LanguageContext);

  const t = <T extends TranslationKey>(
    key: T,
    options: TranslationOptions = {},
  ): SwedishTranslations[T] => {
    const translated = translate(key);

    if (!options.values) return translated;

    const interpolated = interpolateTranslation(translated, options.values);
    return interpolated as SwedishTranslations[T];
  };
  return t;
}
export function useCurrentLanguage() {
  return useContext(LanguageContext);
}
export function useUpdateCurrentLanguage() {
  const updateLanguage = useContext(LanguageSwitcherContext);

  return (lang: string) => {
    setStoredLanguage(lang);
    updateLanguage(lang);
  };
}
const templateExpression = new RegExp('{{([^}}]+)?}}', 'g');
export const interpolateTranslation = (
  translation: string,
  values: string[] | Record<string, string>,
): string => {
  if (Array.isArray(values)) {
    let i = 0;
    const interpolatedTranslation = translation.replace(
      templateExpression,
      (match) => {
        const value = values[i];
        i++;

        if (value) {
          return value;
        }

        return match;
      },
    );
    return interpolatedTranslation;
  }

  // If we pass a record, we replace the {{placeholders}} by name
  const interpolatedTranslation = translation.replace(
    templateExpression,
    (match: string, argName: string) => values[argName] ?? match,
  );

  return interpolatedTranslation;
};
