import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './src/api/Communicator';

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
			await Communicator.getToken()
				.then((tokens) => {
					return Communicator.tokenService.setTokens(tokens);
				}).finally(() => checkIsSignedIn());
		})();
	}, []);

	return (
		<AppContext.Provider
			value={{ isSignedIn, isLoading, setSignedIn, checkIsSignedIn, setMappedRackById, mappedRackNameById }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;