/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import AsyncStorage from '@react-native-async-storage/async-storage';

export enum STORAGE_KEYS {
	CONNECTION_PROPERTIES = '@MyServerConnectionProperties',
	APPLICATION_LANGUAGE = '@ApplicationLanguage',
	ACCESS_TOKEN_EXPIRE_DATE = '@AccessTokenExpireDate',
	REFRESH_TOKEN_EXPIRE_DATE = '@RefreshTokenExpireDate',
	ACCESS_TOKEN = '@AccessToken',
	REFRESH_TOKEN = '@RefreshToken',
}

export const storeData = async (key: STORAGE_KEYS, value: any): Promise<void> => {
	try {
		const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		console.error(e);
	}
};

export const getData = async (key: STORAGE_KEYS): Promise<any> => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		console.error(e);
	}
};

export const removeData = async (key: STORAGE_KEYS): Promise<void> => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.error(e);
	}
};
