import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './../../assets/localization/de.json';
import en from './../../assets/localization/en.json';

i18n
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			de: { translation: de },
		},
		lng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});
