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
		(nveValue, successCallback = () => {
		}) => {
			if (nveValue.startsWith(nvePrefixForCheck) || !nveValue) {
				successCallback && successCallback();
			} else {
				getSoundAndPlay('warningNotification');
			}
		},
		[nvePrefixForCheck],
	);
};

export default useCheckNvePrefix;
