import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './api/Communicator';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
}

export const AppContextProvider = ({ children }: AppContextProviderParams) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSignedIn, setSignedIn] = useState<boolean>(false);

	const checkIsSignedIn = useCallback((setSingInning?: Function) => {
		return Communicator.retrieveTokenOnInit().then((accessToken) => {
			setSingInning && setSingInning();
			setLoading(false);
			setSignedIn(!!accessToken);
		}).finally(() => setLoading(false));
	}, []);
	useEffect(() => {
		Communicator.getToken(true)
			.then((tokens) => {
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