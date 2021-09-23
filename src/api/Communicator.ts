/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import BaseCommunicator from './BaseCommunicator';
import TokenService from '../services/token.service';
import { Platform } from 'react-native';
import { StatusApproved } from '../enums';

export interface ConnectionProperties {
	host: string;
	port: string;
	contextPath: string;
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
		}).then(async (result) => {
			if (result) {
				await this.tokenService.setTokens(result);
			}
			return result;
		});
	}

	public async getToken(): Promise<any> {
		return this.fetchData(
			'api/auth/token',
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: true,
				contentType: 'application/json',
			},
		);
	}

	public retrieveTokenOnInit(): Promise<string | undefined> {
		return this.tokenService.getAccessTokenFromStorage();
	}

	public async createNewDocument(info: any): Promise<string | undefined> {
		return this.fetchData('api/vgg/createNewDocument', {}, info, {
			method: 'POST',
			ignoreTokens: false,
			contentType: 'application/json',
		});
	}

	public async setInternalOrdersReadyForPacking(plIds: number[]): Promise<void> {
		return this.fetchData(
			'api/vgg/setInternalOrdersReadyForPacking',
			{ plIds },
			{},
			{
				method: 'POST',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}

	public async updatePickListsStatus(pickListIds: number[], statusApproved: StatusApproved): Promise<void> {
		return this.fetchData(
			'api/vgg/updatePickListsStatus',
			{ pickListIds, statusApproved },
			{},
			{
				method: 'POST',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}

	public async getAllPickListsByLastScannedLoadingListId(): Promise<any> {
		return this.fetchData(
			'api/vgg/getAllPickListsByLastScannedLoadingListId',
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}

	public getActiveWhId() {
		return this.fetchData(
			`api/vgg/getActiveWhId`,
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}

	public getNvePrefixForCheck() {
		return this.fetchData(
			`api/vgg/getNvePrefixForCheck`,
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}

	public getAllRacks(whId: number) {
		return this.fetchData(
			`api/layouts/${whId}/racks/`,
			{},
			{},
			{
				method: 'GET',
				ignoreTokens: false,
				contentType: 'application/json',
			},
		);
	}
}

const communicatorInstance = new Communicator();

export default communicatorInstance;
