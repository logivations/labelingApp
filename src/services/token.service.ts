/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { getData, removeData, STORAGE_KEYS, storeData } from './AsyncStorageOperations';
import { Communicator } from '../api/Communicator';

class TokenService {
	// @ts-ignore
	private readonly api: any;
	private readonly cache: Map<STORAGE_KEYS, string> = new Map();

	constructor(api: Communicator) {
		this.api = api;
	}

	public static isTokensDatesExpired(): Promise<boolean> {
		return Promise.all(
			[STORAGE_KEYS.ACCESS_TOKEN_EXPIRE_DATE, STORAGE_KEYS.REFRESH_TOKEN_EXPIRE_DATE].map(
				async (storageKey: STORAGE_KEYS) => {
					return getData(storageKey).then((expireDate) => {
						const expiration = parseInt(expireDate, 10);
						if (!isNaN(expiration)) {
							const dateNow = +Date.now();
							return expiration < dateNow;
						} else {
							return true;
						}
					});
				},
			),
		).then((isExpired) => isExpired.some((expire) => expire));
	}

	private static async setTokenExpirationDate(expired: string, storageKey: STORAGE_KEYS): Promise<void> {
		const reservedTime = 0 * 60000;
		const expireDate = Number(expired) - reservedTime;

		return await storeData(storageKey, String(expireDate));
	}

	private static async asyncStoreToken(
		token: string,
		storageKey: STORAGE_KEYS,
		cache: Map<STORAGE_KEYS, string>,
	): Promise<any> {
		if (token) {
			cache.set(storageKey, token);
			return await storeData(storageKey, token);
		}
	}

	public async removeTokens(): Promise<void[]> {
		return Promise.all(
			[
				STORAGE_KEYS.ACCESS_TOKEN,
				STORAGE_KEYS.REFRESH_TOKEN,
				STORAGE_KEYS.ACCESS_TOKEN_EXPIRE_DATE,
				STORAGE_KEYS.REFRESH_TOKEN_EXPIRE_DATE,
			].map(async (key) => await removeData(key)),
		);
	}

	public async setTokens(response: { [key: string]: string }): Promise<void> {
		const { accessExpired, refreshExpired, refreshToken, token } = response;

		await TokenService.asyncStoreToken(token, STORAGE_KEYS.ACCESS_TOKEN, this.cache);
		await TokenService.asyncStoreToken(refreshToken, STORAGE_KEYS.REFRESH_TOKEN, this.cache);
		await TokenService.setTokenExpirationDate(accessExpired, STORAGE_KEYS.ACCESS_TOKEN_EXPIRE_DATE);
		await TokenService.setTokenExpirationDate(refreshExpired, STORAGE_KEYS.REFRESH_TOKEN_EXPIRE_DATE);
	}

	public getCashedTokens(storageKey: STORAGE_KEYS): string | undefined {
		return this.cache.has(storageKey) ? this.cache.get(storageKey) : '';
	}

	public getTokens(ignoreTokens: boolean): Promise<void> {
		return TokenService.isTokensDatesExpired().then((isExpired) => {
			if (isExpired && !ignoreTokens) {
				return new Promise((resolve, reject) => {
					this.api
						.getToken()
						.then(
							async (response: { [key: string]: string }) => {
								await this.setTokens(response);
								resolve();
							},
							(error: any) => reject(error),
						)
						.catch((error: any) => reject(error));
				});
			} else {
				return Promise.resolve();
			}
		});
	}
}

export default TokenService;
