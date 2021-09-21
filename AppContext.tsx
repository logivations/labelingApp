import React, { Context, useCallback, useContext, useEffect, useState } from 'react';
import Communicator from './src/api/Communicator';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
}

export const AppContextProvider = ({ children }: AppContextProviderParams) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isSignedIn, setSignedIn] = useState<boolean>(false);
	const [mappedRacksById, setMappedRackById] = useState<Map<number, string>>(new Map());

	const checkIsSignedIn = useCallback((setSingInning?: Function) => {
		return Communicator.retrieveTokenOnInit().then((accessToken) => {
			setSingInning && setSingInning();
			setLoading(false);
			setSignedIn(!!accessToken);
		}).finally(() => setLoading(false));
	}, []);
	useEffect(() => {
		(async () => {
			await Communicator.getToken(true)
				.then((tokens) => {
					return Communicator.tokenService.setTokens(tokens);
				}).finally(() => checkIsSignedIn());

			const allRacks = await Communicator.getAllRacks();
			const mappedRacks: Map<number, string> = allRacks.reduce((acc: Map<number, string>, rack: any) => {
				acc.set(rack.rackId, rack.text);
				return acc;
			}, new Map());
			setMappedRackById(mappedRacks);
		})();
	}, []);

	return (
		<AppContext.Provider value={{ isSignedIn, isLoading, setSignedIn, checkIsSignedIn, mappedRacksById }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;