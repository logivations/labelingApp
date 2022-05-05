/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Context, useContext } from 'react';
import usePlayAudio from '../hooks/useAudio';
import useLanguage from '../hooks/useLanguage';
import { TFunction } from 'i18next';
import useWarehouseRacks from '../hooks/useWarehouseRacks';

export const AppContext: Context<any> = React.createContext(null);

interface AppContextProviderParams {
	children: any;
	t: TFunction;
}

export const AppContextProvider = ({ children, t }: AppContextProviderParams) => {
	const mappedRacksById = useWarehouseRacks();

	const getSoundAndPlay = usePlayAudio();
	const activeLanguage = useLanguage();

	return (
		<AppContext.Provider
			value={{
				mappedRacksById,
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
