/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/Communicator';
import RouteNames from '../constants/route.names';
// @ts-ignore
import { Toast } from 'popup-ui';
import useAppContext from '../context/AppContext';
import FillInputsController from '../services/FillInputsController';
import useCheckNvePrefix from './useCheckNvePrefix';
import { Colors } from '../components/styles';

const useLabeling = (navigation: any): any => {
	const checkNveByPrefix = useCheckNvePrefix();

	const { getSoundAndPlay, t } = useAppContext();

	const [nve, setNve] = useState<string>('');
	const [ean, setEan] = useState<string>('');
	const [sn, setSn] = useState<string>('');

	const nveRef = useRef(null);
	const eanRef = useRef(null);
	const snRef = useRef(null);

	useEffect(() => {
		checkNveByPrefix(nve);
	}, [nve]);

	useEffect(() => {
		// @ts-ignore
		nveRef.current && nveRef.current.focus();
	}, [nveRef]);

	const createNewDocument = useCallback(async (info) => {
		try {
			await api.createNewDocument(info);
			getSoundAndPlay('successNotification');
			Toast.show({ title: t('NVE_IS_ADDED'), color: Colors.green, timing: 5000 });
		} catch (error) {
			console.log('Error: ', error);
			getSoundAndPlay('warningAlarm');
		}
	}, []);
	const readyForLoadingAction = useCallback(async () => {
		navigation.push(RouteNames.PICK_LISTS);
	}, []);

	const fillLabelingController = useMemo(() => {
		return new FillInputsController(
			createNewDocument,
			[nveRef, eanRef, snRef],
			{ nve: setNve, ean: setEan, sn: setSn },
			['nve', 'ean', 'sn'],
		);
	}, [setNve, setEan, setSn]);

	const clearTextFields = useCallback(() => {
		setNve('');
		setEan('');
		setSn('');
		fillLabelingController.clearFields();
		// @ts-ignore
		nveRef.current && nveRef.current.focus();
	}, [setNve, setEan, setSn, fillLabelingController]);

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
		fillLabelingController,
	};
};

export default useLabeling;
