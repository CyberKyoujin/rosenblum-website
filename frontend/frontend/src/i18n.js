import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationDE from './locales/de/translation.json'
import translationRU from './locales/ru/translation.json';
import translationUA from './locales/ua/translation.json';

const resources = {
    de: {
      translation: translationDE,
    },
    ru: {
      translation: translationRU,
    },
    ua: {
      translation: translationUA,
    },
  };

  i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "de", 

    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;