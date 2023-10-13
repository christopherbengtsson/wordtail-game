import { isDev } from '../../Constants';
import DEFAULT_SV_STRINGS from '../assets/lang/sv';

export const LanguageContainer = {
  map: DEFAULT_SV_STRINGS,
  loaded: false,
  muteErrors: false,
};
export type SwedishTranslations = typeof DEFAULT_SV_STRINGS;

export type TranslationKey = keyof SwedishTranslations;
export type TranslationMap = Record<string, TranslationKey>;

export function translate<T extends TranslationKey>(
  key: T,
): SwedishTranslations[T] {
  const translated = LanguageContainer.map[key];

  if (translated) return translated;

  if (isDev) {
    if (!LanguageContainer.muteErrors) {
      console.log('Translation key missing:', key);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return key as any;
  }
  // Default to Swedish, and then default to the literal key
  return DEFAULT_SV_STRINGS[key] ?? key;
}

export async function fetchLanguageMap(selectedLanguage: string) {
  if (selectedLanguage === 'sv') {
    LanguageContainer.map = DEFAULT_SV_STRINGS;
    LanguageContainer.loaded = true;
    return;
  }
  try {
    const result = await import(`../assets/lang/${selectedLanguage}.ts`);
    LanguageContainer.map = result.default;
  } catch (error) {
    console.error('Failed to fetch language data');
  } finally {
    LanguageContainer.loaded = true;
  }
}
