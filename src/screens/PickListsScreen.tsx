/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, ListColumnWrapper } from '../components/styles';
import PickListItem from '../components/PickListItem';
import api from '../api/Communicator';
import useAppContext from '../context/AppContext';
import PickList from '../models/Picklist';
import PicklistScanStatus from '../enums/PicklistScanStatus';
import { StatusApproved } from '../enums';

// @ts-ignore
const PickListsScreen = ({ stackNavigation, drawerNavigator }) => {
	const { mappedRacksById, t } = useAppContext();
	const [PLList, setPLList] = useState<PickList[]>([]);

	useLayoutEffect(() => {
		const readyForLoadingPicklists = PLList.filter(
			({ scanStatus }) => scanStatus === PicklistScanStatus.READY_FOR_LOADING,
		);
		const readyForLoadingPicklistsIds = readyForLoadingPicklists.map(({ picklistId }) => picklistId);
		stackNavigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={async () => {
						try {
							await api.setInternalOrdersReadyForPacking(readyForLoadingPicklistsIds);
							await api.updatePickListsStatus(readyForLoadingPicklistsIds, StatusApproved.SCANNED);
							await updatePickLists();
						} catch (error) {
							console.error('Error:', error);
						}
					}}
				>
					<View style={styles.checkBtnContainer}>
						<Text style={styles.checkBtnText}>{t('CHECK')}</Text>
					</View>
				</TouchableOpacity>
			),
			headerShown: true,
			title: t('PICK_LISTS'),
		});
		drawerNavigator.setOptions({ headerShown: false });
		return () => {
			drawerNavigator.setOptions({ headerShown: true });
		};
	}, [stackNavigation, drawerNavigator, PLList]);

	const updatePickLists = useCallback(async () => {
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
									rampName: mappedRacksById.get(picklist.ramp).text,
									scanStatus: PicklistScanStatus[picklistScanStatus],
								}),
						),
					];
				},
				[],
			);

			setPLList(allPicklists);
		} catch (error) {
			console.error('Error: ', error);
		}
	}, []);

	useEffect(() => {
		(async () => await updatePickLists())();
	}, []);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeAreaStyle}>
				<View style={styles.headerWrapper}>
					<ListColumnWrapper flex={7}>
						<Text style={styles.headerText}>{t('PICKLIST_ID')}</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={6}>
						<Text style={styles.headerText}>{t('RAMP_NAME')}</Text>
					</ListColumnWrapper>
					<ListColumnWrapper flex={6}>
						<Text style={styles.headerText}>{t('SHIPMENT_TYPE')}</Text>
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
		marginRight: 0,
	},
});

export default PickListsScreen;
