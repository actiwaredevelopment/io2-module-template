import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        ns: 'module',
        load: 'languageOnly',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        backend: {
            // translation file path
            loadPath: '/locales/language/{{ns}}/{{lng}}.json'
        },
        nonExplicitSupportedLngs: true,
        react: {
            bindI18n: 'languageChanged',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b'],
            useSuspense: true
        }
    });

export default i18n;
