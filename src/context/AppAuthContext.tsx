/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Context, createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import api from '../api/Communicator';
import { getData, STORAGE_KEYS } from '../services/AsyncStorageOperations';
import TokenService from '../services/token.service';
import BaseCommunicator from '../api/BaseCommunicator';

const RESTORE_TOKEN = 'RESTORE_TOKEN';
const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_OUT';

const AuthContext: Context<any> = createContext(null);

// @ts-ignore
export const AppAuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(
		(prevState: any, action: any) => {
			switch (action.type) {
				case RESTORE_TOKEN:
					return {
						...prevState,
						userToken: action.userToken,
						userRefreshToken: action.refreshToken,
						isLoading: false,
					};
				case SIGN_IN:
					return { ...prevState, userToken: action.userToken, userRefreshToken: action.refreshToken };
				case SIGN_OUT:
					return { ...prevState, userToken: null, userRefreshToken: null };
				default:
					return { ...prevState };
			}
		},
		{ isLoading: true, userToken: null, userRefreshToken: null },
	);

	const checkIsUserLoggedIn = useCallback(async () => {
		let userToken = null;
		let userRefreshToken = null;
		try {
			await TokenService.isTokensDatesExpired().then(async (isExpired) => {
				if (isExpired) {
					await api.tokenService.removeTokens();
				} else {
					userToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);
					userRefreshToken = await getData(STORAGE_KEYS.REFRESH_TOKEN);
				}
			});
		} catch (e) {
			console.error('Restore token error: ', e);
		} finally {
			dispatch({ type: RESTORE_TOKEN, userToken: userToken, refreshToken: userRefreshToken });
		}
	}, []);

	useEffect(() => {
		(async () => {
			await checkIsUserLoggedIn();
			BaseCommunicator.signOut = async () => {
				await authActions.signOut();
			};
		})();
	}, []);

	const authActions = useMemo(
		() => ({
			async signIn(username: string, password: string, setLoginErrorMessage: Function) {
				try {
					const tokensData = await api.login(username, password);
					tokensData &&
						setLoginErrorMessage(
							tokensData.hasOwnProperty('errorMessage') ? tokensData.errorMessage : null,
						);

					dispatch({ type: SIGN_IN, userToken: tokensData.token, refreshToken: tokensData.refreshToken });
				} catch (e) {
					console.error('Sign in: ', e);
				}
			},
			async signOut() {
				await api.tokenService.removeTokens();
				await api.logout();
				dispatch({ type: SIGN_OUT });
			},
		}),
		[],
	);
	return (
		<AuthContext.Provider value={{ authState: state, authActions, checkIsUserLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAppContext = () => useContext(AuthContext);

export default useAppContext;
