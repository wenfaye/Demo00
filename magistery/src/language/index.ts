import { createI18n } from 'vue-i18n';
import { getLanguage } from '@/utils/auth';

import elementEnLocale from 'element-plus/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'; // element-ui lang
import elementEsLocale from 'element-plus/lib/locale/lang/es'; // element-ui lang
import enLocale from './en';
import zhLocale from './zh';
import esLocale from './es';

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
  es: {
    ...esLocale,
    ...elementEsLocale,
  },
};

export const getLocale = () => {
  const cookieLanguage = getLanguage();
  if (cookieLanguage) {
    return cookieLanguage;
  }

  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }

  // Default language is english
  return 'en';
};

const i18n = createI18n({
  locale: 'zh',
  messages: {
    en: {
      ...enLocale,
      ...elementEnLocale,
    },
    zh: {
      ...zhLocale,
      ...elementZhLocale,
    },
    es: {
      ...esLocale,
      ...elementEsLocale,
    },
  },
});

export default i18n;
