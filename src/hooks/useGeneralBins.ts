/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useState } from 'react';
import Communicator from '../api/Communicator';
import Bin from '../models/Bin';

const useGeneralBins = () => {
	const mapBinToList = (bin: Bin) => ({ value: `${bin.rackId}-${bin.id}`, label: bin.text });

	const [generalBins, setGeneralBins] = useState<Map<number, Map<number, Bin>>>(new Map());
	const [allBins, setAllBins] = useState<Bin[]>([]);

	useEffect(() => {
		(async () => {
			const bins = await Communicator.getGeneralBinsByStages([3, 4]).then((generalBinsByStage) => {
				console.log('allBins', generalBinsByStage);
				setAllBins(generalBinsByStage.map((bin: Bin) => ({
					value: `${bin.rackId}-${bin.id}`,
					label: bin.text,
				})));
				return generalBinsByStage.reduce((mappedBinsByRackId: Map<number, Map<number, Bin>>, bin: Bin) => {
					if (mappedBinsByRackId.has(bin.rackId)) {
						const binMap = mappedBinsByRackId.get(bin.rackId);
						binMap?.set(bin.id, new Bin(bin));
					} else {
						const binMap = new Map();
						binMap.set(bin.id, new Bin(bin));
						mappedBinsByRackId.set(bin.rackId, binMap);
					}
					return mappedBinsByRackId;
				}, new Map());
			});

			setGeneralBins(bins);
		})();
	}, []);


	return useCallback((rackId?: number | string, binId?: number | string) => {
		if (rackId && binId) {
			if (generalBins.has(Number(rackId))) {
				const rackBins = generalBins.get(Number(rackId));
				return rackBins?.has(Number(binId)) ? rackBins.get(Number(binId)) : null;
			} else {
				return null;
			}
		} else {
			return allBins;
		}
	}, [generalBins, allBins]);
};

export default useGeneralBins;
