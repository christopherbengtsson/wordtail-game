import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { getStoredLanguage } from '../components/Language/sessionStorage';

export const distanceToNow = (date: string, options?: object) => {
  getLocaleByLang();
  return formatDistanceToNow(new Date(date), {
    ...options,
    locale: getLocaleByLang(),
  });
};

const getLocaleByLang = () => {
  const lang = getStoredLanguage();
  if (lang === 'sv-SE') {
    return sv;
  }
};
