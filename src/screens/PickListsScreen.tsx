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
					<View style={styles.checkBtnContainer}>
						<Text style={styles.checkBtnText}>Check</Text>
					</View>
				</TouchableOpacity>
			),
			headerShown: true,
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
					<ListColumnWrapper flex={7}>
						<Text style={styles.headerText}>Picklist ID</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={6}>
						<Text style={styles.headerText}>Ramp name</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={6}>
						<Text style={styles.headerText}>Shipm. type</Text>
					</ListColumnWrapper>
				</View>
				<FlatList
					data={PLList}
					renderItem={(props) => <PickListItem {...props.item} />}
					keyExtractor={(item, index) => item.picklistId.toString()}
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
		paddingLeft: 10,
		paddingRight: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		height: 38,
	},
	headerText: {
		fontWeight: 'bold',
		padding: 0,
	},
	checkBtnText: {
		fontWeight: 'bold',
		fontSize: 14,
		color: Colors.primary,
		padding: 15,
		paddingTop: 7,
		paddingBottom: 7,
	},
	checkBtnContainer: {
		borderWidth: 1,
		borderRadius: 5,
		borderColor: Colors.green,
		backgroundColor: Colors.green,
	},
});

export default PickListsScreen;
