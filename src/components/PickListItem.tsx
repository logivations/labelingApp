/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Picklist from '../models/Picklist';
import { Colors, ListItemWrapper } from './styles';
import { PicklistScanStatus, ShipmentType } from '../enums';
// @ts-ignore
import CheckIcon from './../../assets/icons/circle-check-icon.svg';
// @ts-ignore
import CrossIcon from './../../assets/icons/circle-cross-icon.svg';
// @ts-ignore
import WarnIcon from './../../assets/icons/circle-warning-icon.svg';

const IconByStatus = ({ status }: { status: PicklistScanStatus }) => {
	switch (status) {
		case PicklistScanStatus.READY_FOR_LOADING:
			return <CheckIcon />;
		case PicklistScanStatus.NOT_FOUND:
			return <CrossIcon />;
		case PicklistScanStatus.NOT_COMPLETE:
			return <WarnIcon />;
	}
};

const PickListItem: React.FC<Picklist> = ({ picklistId, rampName, shipmentType, scanStatus }) => {
	return (
		<TouchableHighlight activeOpacity={0.4} underlayColor={Colors.primary}>
			<ListItemWrapper scanStatus={scanStatus}>
				<View style={styles.picklistId}>
					<Text>{picklistId}</Text>
				</View>
				<View style={styles.rampName}>
					<Text>{rampName}</Text>
				</View>
				<View style={styles.shipmentType}>
					<Text>{ShipmentType[shipmentType]}</Text>
				</View>
				<View style={styles.status}>
					<IconByStatus status={scanStatus} />
				</View>
			</ListItemWrapper>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	picklistId: {
		paddingLeft: 10,
		paddingRight: 10,
		flex: 7,
	},
	rampName: {
		flex: 6,
		paddingLeft: 10,
		paddingRight: 10,
		alignItems: 'flex-start',
		justifyContent: 'center',
		height: '100%',
		borderLeftColor: Colors.secondary,
		borderLeftWidth: 1,
	},
	shipmentType: {
		flex: 3,
		paddingLeft: 10,
		paddingRight: 10,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		borderLeftColor: Colors.secondary,
		borderLeftWidth: 1,
	},
	status: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		borderLeftColor: Colors.secondary,
		borderLeftWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
	},
});

export default PickListItem;
