/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import TokenService from '../services/token.service';
import { getData, STORAGE_KEYS } from '../services/AsyncStorageOperations';
import { ConnectionProperties } from './Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import { Colors } from '../components/styles';

class BaseCommunicator {
	public tokenService!: TokenService;
	private readonly connectionProperties: ConnectionProperties = { host: '', port: '', contextPath: '' };

	constructor() {
		getData(STORAGE_KEYS.CONNECTION_PROPERTIES).then((result: string) => {
			if (result) {
				const connectionProperties: ConnectionProperties = JSON.parse(result);
				this.saveConnectionProperties(connectionProperties);
			}
		});
	}

	public get isExistConnectionProperties(): boolean {
		return !!this.connectionProperties.host
			&& !!this.connectionProperties.port
			&& !!this.connectionProperties.contextPath;
	}

	protected setTokenService(tokenService: TokenService) {
		this.tokenService = tokenService;
	}

	private get serverUrl(): string {
		return `${this.connectionProperties.host}:${this.connectionProperties.port}/${this.connectionProperties.contextPath}`;
	}

	public saveConnectionProperties(properties: ConnectionProperties) {
		this.connectionProperties.host = properties.host;
		this.connectionProperties.port = properties.port;
		this.connectionProperties.contextPath = properties.contextPath;
	}

	public async logout() {
		await this.fetchData('j_spring_security_logout', {}, {}, {
			method: 'GET',
			contentType: 'text/plain',
			ignoreTokens: true,
		});
		await this.tokenService.removeTokens();
	}

	private getUrlByContextPath(path: string): string {
		return `${this.serverUrl}/${path}`;
	}

	private getUrlWithQueryParameters(path: string, query: object): string {
		const queryParams = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => queryParams.append(key, value));
		return `${this.getUrlByContextPath(path)}${queryParams.toString() && `?${queryParams.toString()}`}`;
	}

	// 23mOHi,

	private getConfig(params: { [key: string]: any }, body: any): object {
		const getHeaders = () => {
			const token = this.tokenService.getCashedTokens(STORAGE_KEYS.ACCESS_TOKEN);
			return Object.assign({
				'Accept': '*/*',
				'Connection': 'keep-alive',
				'Content-Type': params.contentType,
				'Access-Control-Allow-Methods': 'POST, GET',
				'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, X-Requested-With',
			}, token ? { 'Authorization': token } : {});
		};
		return Object.assign({
			method: params.method,
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: getHeaders(),
		}, params.method === 'POST' ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {});
	}

	protected async fetchData(
		path: string,
		query: object = {},
		body: any = {},
		params: { contentType?: string, method: string, ignoreTokens: boolean } = {
			contentType: 'application/json',
			method: 'GET',
			ignoreTokens: false,
		},
	): Promise<any> {
		return this.tokenService.getTokens(params.ignoreTokens).then(() => {
			return new Promise((resolve, reject) => {
				console.log('Request URL: ', this.getUrlWithQueryParameters(path, query));
				fetch(this.getUrlWithQueryParameters(path, query), this.getConfig(params, body))
					.then(async (response) => {
						if (response.ok) {
							const responseText = await response.text();
							try {
								resolve(JSON.parse(responseText));
							} catch (e) {
								resolve(responseText);
							}
						} else {
							let error = new Error(`Response not OK, response status: ${response.status}.`);
							if (response.status === 401) {
								await this.logout();
							}
							try {
								const responseText = await response.text();
								try {
									const respJson = JSON.parse(responseText);
									if (respJson.hasOwnProperty('errorMessage')) {
										error = new Error(respJson.errorMessage);
										reject(respJson);
									}
								} catch (e) {
									reject(responseText);
								}
							} finally {
								Toast.show({
									title: error.name,
									text: error.message,
									color: Colors.red,
									timing: 10000,
								});
								reject(error);
							}
						}
					});
			});
		});
	}

}

export default BaseCommunicator;