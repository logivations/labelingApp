/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useState } from 'react';
import Communicator from '../api/Communicator';
import useAppContext from '../../AppContext';

const useCheckNvePrefix = () => {
	const { getSoundAndPlay } = useAppContext();
	const [nvePrefixesForCheck, setNvePrefixForCheck] = useState<string[]>(['']);

	useEffect(() => {
		(async () => {
			try {
				const nvePrefixStr = await Communicator.getNvePrefixForCheck();
				if (nvePrefixStr) {
					const nvePrefixes = JSON.parse(nvePrefixStr);

					setNvePrefixForCheck(nvePrefixes);
				}
			} catch (error) {
				setNvePrefixForCheck(['']);
			}
		})();
	}, []);

	return useCallback(
		(nveValue, successCallback = () => {
		}) => {
			if (nvePrefixesForCheck.some((prefixForCheck) => nveValue.startsWith(prefixForCheck)) || !nveValue) {
				successCallback && successCallback();
			} else {
				getSoundAndPlay('warningNotification');
			}
		},
		[nvePrefixesForCheck],
	);
};

export default useCheckNvePrefix;
