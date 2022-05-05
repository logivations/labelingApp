/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useState } from 'react';
import Communicator from '../api/Communicator';

interface IRack {
	text: string;
	rackId: number;
	pickPriority: number;
	bins: Map<BinId, IBin>;
}

interface IBin {
	text: string;
	rackId: number;
	binId: number;
	sequence: string;
}

type RackId = number;
type BinId = number;

const useWarehouseRacksBins = () => {
	const [mappedRackNameById, setMappedRackById] = useState<Map<RackId, IRack>>(new Map());

	const getMappedBinsById = useCallback((allBins): Map<RackId, Map<BinId, IBin>> => {
		return allBins.reduce((acc: Map<RackId, Map<BinId, IBin>>, bin: any) => {
			const binObj = {
				text: bin.text,
				rackId: bin.rackId,
				binId: bin.id,
				sequence: bin.assignmentSequence || '',
			};
			if (acc.has(bin.rackId)) {
				acc.get(bin.rackId)?.set(binObj.binId, binObj);
			} else {
				const binMap: Map<BinId, IBin> = new Map();
				binMap.set(binObj.binId, binObj);
				acc.set(bin.rackId, binMap);
			}
			return acc;
		}, new Map());
	}, []);

	const getMappedRacksById = useCallback((allRacks, mappedBinsById): Map<RackId, IRack> => {
		return allRacks.reduce((acc: Map<RackId, IRack>, rack: any) => {
			acc.set(rack.rackId, {
				text: rack.text,
				rackId: rack.rackId,
				pickPriority: rack.pickPriority,
				bins: mappedBinsById.get(rack.rackId),
			});
			return acc;
		}, new Map());
	}, []);

	useEffect(() => {
		(async () => {
			const allBins = await Communicator.getAllBins();
			const mappedBinsById = getMappedBinsById(allBins);

			const allRacks = await Communicator.getAllRacks();
			const mappedRacksById = getMappedRacksById(allRacks, mappedBinsById);

			setMappedRackById(mappedRacksById);
		})();
	}, []);

	return mappedRackNameById;
};

export default useWarehouseRacksBins;
