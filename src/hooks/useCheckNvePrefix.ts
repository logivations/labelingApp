/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useState } from 'react';
import Communicator from '../api/Communicator';
import useAppContext from '../../AppContext';

const useCheckNvePrefix = () => {
	const { getSoundAndPlay } = useAppContext();
	const [nvePrefixForCheck, setNvePrefixForCheck] = useState<string>('');

	useEffect(() => {
		(async () => {
			const nvePrefix = await Communicator.getNvePrefixForCheck();
			setNvePrefixForCheck(nvePrefix);
		})();
	}, []);

	return useCallback(
		async (nveValue, successCallback) => {
			if (nveValue.startsWith(nvePrefixForCheck) || !nveValue) {
				successCallback();
			} else {
				getSoundAndPlay('warningSignal');
			}
		},
		[nvePrefixForCheck],
	);
};

export default useCheckNvePrefix;
