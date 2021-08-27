/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import BaseCommunicator from './BaseCommunicator';
import TokenService from './../services/token.service';
import { Platform } from 'react-native';

export interface ConnectionProperties {
	host: string,
	port: string,
	contextPath: string
}

export class Communicator extends BaseCommunicator {
	static Instance: Communicator;

	constructor() {
		super();
		if (!Communicator.Instance) {
			Communicator.Instance = this;

			super.setTokenService(new TokenService(this));
		}
		return Communicator.Instance;
	}

	public async login(username: string, password: string) {
		const formData = new FormData();
		formData.append('username', username);
		formData.append('password', password);
		return this.fetchData('auth/login', {}, formData, {
			method: 'POST',
			ignoreTokens: true,
			contentType: Platform.OS === 'ios' ? 'application/json' : 'multipart/form-data',
		})
			.then(async (result) => {
				if (result) {
					await this.tokenService.setTokens(result);
				}
				return result;
			})
	}

	public async logout() {
		await this.fetchData('j_spring_security_logout', {}, {}, {
			method: 'GET',
			contentType: 'text/plain',
			ignoreTokens: true,
		});
		await this.tokenService.removeTokens();
	}

	public async getToken(ignoreTokens: boolean): Promise<any> {
		return this.fetchData('api/auth/token', {}, {}, {
			method: 'GET',
			ignoreTokens,
			contentType: 'application/json',
		});
	}

	public retrieveTokenOnInit(): Promise<string | undefined> {
		return this.tokenService.getAccessTokenFromStorage();
	}
}

const communicatorInstance = new Communicator();

export default communicatorInstance;