/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './src/api/Communicator';
import usePlayAudio from './src/hooks/useAudio';
import initI18n from './src/i18n/i18n.index';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
}

export const AppContextProvider = ({ children }: AppContextProviderParams) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSignedIn, setSignedIn] = useState<boolean>(false);
	const [mappedRackNameById, setMappedRackById] = useState<Map<number, string>>(new Map());

	const checkIsSignedIn = useCallback((setSingInning?: Function) => {
		return Communicator.retrieveTokenOnInit().then((accessToken) => {
			setSingInning && setSingInning();
			setLoading(false);
			setSignedIn(!!accessToken);
		}).finally(() => setLoading(false));
	}, []);
	useEffect(() => {
		(async () => {
			await initI18n();
			await Communicator.getToken()
				.then((tokens) => {
					return Communicator.tokenService.setTokens(tokens);
				}).finally(() => checkIsSignedIn());
		})();
	}, []);

	const getSoundAndPlay = usePlayAudio();

	return (
		<AppContext.Provider
			value={{
				isSignedIn,
				isLoading,
				setSignedIn,
				checkIsSignedIn,
				setMappedRackById,
				mappedRackNameById,
				getSoundAndPlay,
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;