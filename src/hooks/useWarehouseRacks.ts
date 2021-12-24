/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useEffect, useState } from 'react';
import Communicator from '../api/Communicator';

const useWarehouseRacks = () => {
	const [mappedRackNameById, setMappedRackById] = useState<Map<number, string>>(new Map());

	useEffect(() => {
		(async () => {
			const allRacks = await Communicator.getAllRacks();
			const mappedRackNameById: Map<number, string> = allRacks.reduce((acc: Map<number, string>, rack: any) => {
				acc.set(rack.rackId, rack.text);
				return acc;
			}, new Map());

			setMappedRackById(mappedRackNameById);
		})();
	}, []);

	return mappedRackNameById;
};

export default useWarehouseRacks;
