/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './src/api/Communicator';
import usePlayAudio from './src/hooks/useAudio';
import useLanguage from './src/hooks/useLanguage';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
	t: any;
}

export const AppContextProvider = ({ children, t }: AppContextProviderParams) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSignedIn, setSignedIn] = useState<boolean>(false);
	const [mappedRackNameById, setMappedRackById] = useState<Map<number, string>>(new Map());
	const checkIsSignedIn = useCallback((setSingInning?: Function) => {
		return Communicator.retrieveTokenOnInit().then((accessToken) => {
			setSingInning && setSingInning();
			setSignedIn(!!accessToken);
		}).finally(() => setLoading(false));
	}, []);
	useEffect(() => {
		(async () => {
			await Communicator.getToken()
				.then((tokens) => {
					return Communicator.tokenService.setTokens(tokens);
				}).finally(() => checkIsSignedIn());
		})();
	}, []);

	const getSoundAndPlay = usePlayAudio();
	const activeLanguage = useLanguage();

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
				activeLanguage,
				t,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;