import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './api/Communicator';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
}

export const AppContextProvider = ({ children }: AppContextProviderParams) => {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [isSignedIn, setSignedIn] = useState<boolean>(false);

	const checkIsSignedIn = useCallback((setSingInning?: Function) => {
		return Communicator.retrieveTokenOnInit().then((accessToken) => {
			setSingInning && setSingInning();
			setLoading(false);
			setSignedIn(!!accessToken);
		});
	}, []);
	useEffect(() => {
		Communicator.getToken(true)
			.then(async (tokens) => {
				tokens = await tokens.json();
				return Communicator.tokenService.setTokens(tokens);
			}).finally(() => checkIsSignedIn());
	}, []);

	return (
		<AppContext.Provider value={{ isSignedIn, isLoading, setSignedIn, checkIsSignedIn }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;