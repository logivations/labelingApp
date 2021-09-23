/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useEffect } from 'react';
import Communicator from '../api/Communicator';
import useAppContext from '../../AppContext';

const useWarehouseRacks = () => {
	const { setMappedRackById } = useAppContext();

	useEffect(() => {
		(async () => {
			const whId = await Communicator.getActiveWhId();
			const allRacks = await Communicator.getAllRacks(whId);
			const mappedRackNameById: Map<number, string> = allRacks.reduce((acc: Map<number, string>, rack: any) => {
				acc.set(rack.rackId, rack.text);
				return acc;
			}, new Map());

			setMappedRackById(mappedRackNameById);
		})();
	}, []);
};

export default useWarehouseRacks;