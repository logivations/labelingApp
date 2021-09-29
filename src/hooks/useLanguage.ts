/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { getData, STORAGE_KEYS, storeData } from '../services/AsyncStorageOperations';

const useLanguage = () => {
	const [activeLng, setLng] = useState<string>(i18next.language);
	useEffect(() => {
		getData(STORAGE_KEYS.APPLICATION_LANGUAGE).then(async (lng) => {
			setLng(lng);
			lng && await i18next.changeLanguage(lng);
		});
		i18next.on('languageChanged', async (lng) => {
			await storeData(STORAGE_KEYS.APPLICATION_LANGUAGE, lng);
			setLng(lng);
		});
	}, []);
	return activeLng;
};

export default useLanguage;