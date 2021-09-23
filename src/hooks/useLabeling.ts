import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/Communicator';
import RouteNames from '../constants/route.names';
// @ts-ignore
import { Toast } from 'popup-ui';
import useAppContext from '../../AppContext';


const useLabeling = (navigation: any): any => {
	const { getSoundAndPlay } = useAppContext();
	const [nve, setNve] = useState<string>('');
	const [ean, setEan] = useState<string>('');
	const [sn, setSn] = useState<string>('');

	const nveRef = useRef(null);
	const eanRef = useRef(null);
	const snRef = useRef(null);

	useEffect(() => {
		// @ts-ignore
		nveRef.current && nveRef.current.focus();
	}, [nveRef]);

	const clearTextFields = useCallback(() => {
		setNve('');
		setEan('');
		setSn('');
	}, [setNve, setEan, setSn]);

	const createNewDocument = useCallback(async (info) => {
		try {
			await api.createNewDocument(info);
			Toast.show({ title: 'NVE_IS_ADDED' });
		} catch (error) {
			console.log('Error: ', error);
			getSoundAndPlay('successSignal');
		}
	}, []);
	const readyForLoadingAction = useCallback(async () => {
		navigation.push(RouteNames.PICK_LISTS);
	}, []);

	return {
		nve,
		ean,
		sn,
		setNve,
		setEan,
		setSn,
		nveRef,
		eanRef,
		snRef,
		clearTextFields,
		createNewDocument,
		readyForLoadingAction,
	};
};

export default useLabeling;