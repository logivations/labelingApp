/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { useCallback, useEffect, useMemo, useState } from 'react';
import Communicator from '../api/Communicator';
import Bin from '../models/Bin';

const useGeneralBins = (eanOld: string) => {
	const [generalBins, setGeneralBins] = useState<Bin[]>([]);
	const [allBins, setAllBins] = useState<Bin[]>([]);

	useEffect(() => {
		const stages = { third: 3, fourth: 4 };
		Communicator.getGeneralBinsByStages([stages.third, stages.fourth]).then((generalBinsByStage) => {
			setAllBins(generalBinsByStage);
			setGeneralBins(generalBinsByStage.map((generalBin: any) => new Bin(generalBin)));
		});
	}, []);

	const getBinByRackIdBinId = useCallback(
		(rackId?: number | string, binId?: number | string) => {
			if (rackId && binId) {
				return generalBins.find((bin) => bin.equals(rackId, binId)) || null;
			} else {
				return generalBins;
			}
		},
		[generalBins, allBins],
	);

	const handleFilterGeneralBins = useCallback(
		(ean?: string) => {
			if (ean) {
				Communicator.getGeneralBinsWithStockByEAN(ean).then((filteredGeneralBinsData) => {
					setGeneralBins(filteredGeneralBinsData.map((generalBin: any) => new Bin(generalBin)));
				});
			} else {
				setGeneralBins(() => allBins.map((generalBin: any) => new Bin(generalBin)));
			}
		},
		[allBins],
	);

	useEffect(() => {
		!eanOld && handleFilterGeneralBins();
	}, [eanOld]);

	const mappedGeneralBinsForDropdown = useMemo(() => {
		return generalBins.map((bin: Bin) => ({ value: `${bin.rackId}-${bin.id}`, label: bin.text }));
	}, [generalBins]);

	return {
		getBinByRackIdBinId,
		generalBins,
		mappedGeneralBinsForDropdown,
		handleFilterGeneralBins,
	};
};

export default useGeneralBins;
