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
		this.runPingInterval();
	}

	public get isExistConnectionProperties(): boolean {
		return (
			!!this.connectionProperties.host &&
			!!this.connectionProperties.port &&
			!!this.connectionProperties.contextPath
		);
	}

	private get serverUrl(): string {
		return `${this.connectionProperties.host}:${this.connectionProperties.port}/${this.connectionProperties.contextPath}`;
	}

	static signOut: Function = () => {};

	public ping(properties?: ConnectionProperties) {
		if (properties) {
			const url = `${properties.host}:${properties.port}/${properties.contextPath}/anonymous/ping`;
			return fetch(url, { method: 'GET' });
		}
		return this.fetchData(
			`anonymous/ping`,
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: true,
				contentType: 'application/json',
			},
		);
	}

	public saveConnectionProperties(properties: ConnectionProperties) {
		this.connectionProperties.host = properties.host;
		this.connectionProperties.port = properties.port;
		this.connectionProperties.contextPath = properties.contextPath;
	}

	public async logout() {
		await this.tokenService.removeTokens();
		await this.fetchData(
			'j_spring_security_logout',
			{},
			{},
			{
				method: 'GET',
				contentType: 'text/plain',
				ignoreTokens: true,
			},
		);
	}

	protected setTokenService(tokenService: TokenService) {
		this.tokenService = tokenService;
	}

	protected async fetchData(
		path: string,
		query: object = {},
		body: any = {},
		params: { contentType?: string; method: string; ignoreTokens: boolean } = {
			contentType: 'application/json',
			method: 'GET',
			ignoreTokens: false,
		},
	): Promise<any> {
		return this.tokenService.getTokens(params.ignoreTokens).then(() => {
			return new Promise((resolve, reject) => {
				console.log('Request URL: ', this.getUrlWithQueryParameters(path, query));
				fetch(this.getUrlWithQueryParameters(path, query), this.getConfig(params, body)).then(
					async (response) => {
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
								await BaseCommunicator.signOut();
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
									timing: 5000,
								});
								reject(error);
							}
						}
					},
				);
			});
		});
	}

	private runPingInterval(): void {
		setInterval(async () => {
			await this.ping();
		}, 60000);
	}

	private getUrlByContextPath(path: string): string {
		return `${this.serverUrl}/${path}`;
	}

	private getUrlWithQueryParameters(path: string, query: object): string {
		const queryParams = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => queryParams.append(key, value));
		return `${this.getUrlByContextPath(path)}${queryParams.toString() && `?${queryParams.toString()}`}`;
	}

	private getConfig(params: { [key: string]: any }, body: any): object {
		const token = this.tokenService.getCashedTokens(STORAGE_KEYS.ACCESS_TOKEN);
		const refreshToken = this.tokenService.getCashedTokens(STORAGE_KEYS.REFRESH_TOKEN);
		const getHeaders = () => {
			return Object.assign(
				{
					Accept: '*/*',
					Connection: 'keep-alive',
					'Content-Type': params.contentType,
					'Access-Control-Allow-Methods': 'POST, GET',
					'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, X-Requested-With',
				},
				token ? { Authorization: token } : {},
				refreshToken ? { Refresh: refreshToken } : {},
			);
		};
		const cookie = (() => {
			let baseCookie = '';
			token && (baseCookie += `Authorization=${token}; `);
			refreshToken && (baseCookie += `Refresh=${refreshToken}; `);
			return baseCookie;
		})();

		return Object.assign(
			{
				method: params.method,
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: getHeaders(),
			},
			cookie ? { Cookie: cookie } : {},
			params.method === 'POST' || params.method === 'PUT'
				? { body: body instanceof FormData ? body : JSON.stringify(body) }
				: {},
		);
	}
}

export default BaseCommunicator;
