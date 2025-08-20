import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// load resources from src/localization
import en from './localization/en';
import ja from './localization/ja';

// list of enabled localization
const resources = {
  en,
  ja,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Set the default Language. Options from resources defined above.
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: { useSuspense: false }, //this line
});

export default i18n;
