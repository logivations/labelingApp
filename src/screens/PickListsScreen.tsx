/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../components/styles';
import PickListItem from '../components/PickListItem';
import api from '../api/Communicator';
import useAppContext from '../../AppContext';
import { PicklistScanStatus } from '../enums';
import PickList from '../models/Picklist';

const PickListsScreen = () => {
	const { mappedRacksById } = useAppContext();
	const [PLList, setPLList] = useState<any[]>([]);
	useEffect(() => {
		(async () => {
			const picklistsByLastLoadingList = await api.getAllPickListsByLastScannedLoadingListId();
			const allPicklists = Object.keys(picklistsByLastLoadingList).reduce((acc: PickList[], picklistScanStatus: any) => {
				return [
					...acc,
					...picklistsByLastLoadingList[picklistScanStatus].map((picklist: any) => new PickList({
						...picklist,
						rampName: mappedRacksById.get(picklist.ramp),
						scanStatus: PicklistScanStatus[picklistScanStatus],
					})),
				];
			}, []);
			setPLList([...allPicklists, ...allPicklists, ...allPicklists, ...allPicklists, ...allPicklists, ...allPicklists]);
		})();
	}, []);

	return <View style={styles.container}>
		<SafeAreaView>
			<FlatList
				data={PLList}
				renderItem={(props) => <PickListItem {...props.item} />}
				keyExtractor={(item, index) => `${index}-${item.picklistId.toString()}`}
			/>
		</SafeAreaView>
	</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingBottom: 16,
		backgroundColor: Colors.primary,
		width: '100%',
	},
});

export default PickListsScreen;
