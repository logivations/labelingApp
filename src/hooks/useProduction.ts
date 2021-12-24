/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RouteNames from '../constants/route.names';
import FillInputsController from '../services/FillInputsController';

const useProduction = (navigation: any) => {
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
			console.log('info', info);
			//TODO add confirm action
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
