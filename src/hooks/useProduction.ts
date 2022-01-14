/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RouteNames from '../constants/route.names';
import FillInputsController from '../services/FillInputsController';
import api from '../api/Communicator';
import Bin from '../models/Bin';
import { Colors } from '../components/styles';
// @ts-ignore
import { Toast } from 'popup-ui';
import useAppContext from '../context/AppContext';

const useProduction = (navigation: any, selectedBin: Bin) => {
	const { t } = useAppContext();

	const [eanOld, setEanOld] = useState<string>('');
	const [eanNew, setEanNew] = useState<string>('');
	const [sn, setSn] = useState<string>('');

	const eanOldRef = useRef(null);
	const eanNewRef = useRef(null);
	const snRef = useRef(null);

	useEffect(() => {
		// @ts-ignore
		eanOldRef.current && eanOldRef.current.focus();
	}, [eanOldRef]);

	const readyForProductionAction = useCallback(async () => {
		navigation.push(RouteNames.PRODUCTION);
	}, []);

	const createNewDocument = useCallback(async (info) => {
		try {
			console.log('selectedBin', selectedBin);
			await api.confirmProductionMode({
				rackId: selectedBin.getRackId(),
				binId: selectedBin.getBinId(),
				newEan: info.eanNew,
				oldEan: info.eanOld,
				sn: info.sn,
			});
			Toast.show({ title: t('PROCESSED_SUCCESSFULLY'), color: Colors.green, timing: 5000 });
		} catch (error) {
			console.log('Error: ', error);
		}
	}, []);

	const fillProductionController = useMemo(() => {
		return new FillInputsController(
			createNewDocument,
			[eanOldRef, eanNewRef, snRef],
			{ eanOld: setEanOld, eanNew: setEanNew, sn: setSn },
			['eanOld', 'eanNew', 'sn'],
		);
	}, [setEanOld, setEanNew, setSn]);

	const clearTextFields = useCallback(() => {
		setEanOld('');
		setEanNew('');
		setSn('');
		fillProductionController.clearFields();
		// @ts-ignore
		eanOld.current && eanOld.current.focus();
	}, [setEanOld, setEanNew, setSn, fillProductionController]);

	return {
		eanOld,
		eanNew,
		sn,
		setEanOld,
		setEanNew,
		setSn,
		eanOldRef,
		eanNewRef,
		snRef,
		clearTextFields,
		createNewDocument,
		readyForProductionAction,
		fillProductionController,
	};
};

export default useProduction;
