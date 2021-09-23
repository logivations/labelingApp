/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, ListColumnWrapper } from '../components/styles';
import PickListItem from '../components/PickListItem';
import api from '../api/Communicator';
import useAppContext from '../../AppContext';
import PickList from '../models/Picklist';
import PicklistScanStatus from '../enums/PicklistScanStatus';
import { StatusApproved } from '../enums';

// @ts-ignore
const PickListsScreen = ({ navigation }) => {
	const { mappedRackNameById } = useAppContext();
	const [PLList, setPLList] = useState<PickList[]>([]);

	useLayoutEffect(() => {
		const readyForLoadingPicklists = PLList.filter(
			({ scanStatus }) => scanStatus === PicklistScanStatus.READY_FOR_LOADING,
		);
		const readyForLoadingPicklistsIds = readyForLoadingPicklists.map(({ picklistId }) => picklistId);
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={async () => {
						try {
							await api.setInternalOrdersReadyForPacking(readyForLoadingPicklistsIds);
							await api.updatePickListsStatus(readyForLoadingPicklistsIds, StatusApproved.SCANNED);
						} catch (error) {
							console.log('Error:', error);
						}
					}}
				>
					<Text style={styles.checkBtnText}>Check</Text>
				</TouchableOpacity>
			),
		});
	}, [navigation, PLList]);

	useEffect(() => {
		(async () => {
			try {
				const picklistsByLastLoadingList = await api.getAllPickListsByLastScannedLoadingListId();

				const allPicklists = Object.keys(picklistsByLastLoadingList).reduce(
					(acc: PickList[], picklistScanStatus: any) => {
						return [
							...acc,
							...picklistsByLastLoadingList[picklistScanStatus].map(
								(picklist: any) =>
									new PickList({
										...picklist,
										rampName: mappedRackNameById.get(picklist.ramp),
										scanStatus: PicklistScanStatus[picklistScanStatus],
									}),
							),
						];
					},
					[],
				);

				setPLList([...allPicklists, ...allPicklists, ...allPicklists]);
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	}, []);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeAreaStyle}>
				<View style={styles.headerWrapper}>
					<ListColumnWrapper flex={5}>
						<Text style={styles.headerText}>Picklist ID</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={6}>
						<Text style={styles.headerText}>Ramp name</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={3}>
						<Text style={styles.headerText}>Shipm. type</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={1}/>
				</View>
				<FlatList
					data={PLList}
					renderItem={(props) => <PickListItem {...props.item} />}
					keyExtractor={(item, index) => `${index}-${item.picklistId.toString()}`}
				/>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: Colors.primary,
	},
	safeAreaStyle: {
		paddingTop: 16,
		marginBottom: 40,
		width: '100%',
	},
	headerWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		height: 38,
	},
	headerText: {
		fontWeight: 'bold',
	},
	checkBtnText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: Colors.green,
		borderWidth: 1,
		padding: 5,
		borderRadius: 5,
		borderColor: Colors.green,
	},
});

export default PickListsScreen;
