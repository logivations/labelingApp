/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
// @ts-ignore-file

import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Picklist from '../models/Picklist';
import { Colors, getColorByStatus, ListItemWrapper, TooltipContainer, TooltipText } from './styles';
import { PicklistScanStatus, ShipmentType } from '../enums';
import Tooltip from 'react-native-walkthrough-tooltip';
// @ts-ignore
import CheckIcon from './../../assets/icons/circle-check-icon.svg';
// @ts-ignore
import CrossIcon from './../../assets/icons/circle-cross-icon.svg';
// @ts-ignore
import WarnIcon from './../../assets/icons/circle-warning-icon.svg';
import useAppContext from '../../AppContext';

const IconByStatus = ({ status }: { status: PicklistScanStatus }) => {
	switch (status) {
		case PicklistScanStatus.READY_FOR_LOADING:
			return <CheckIcon/>;
		case PicklistScanStatus.NOT_FOUND:
			return <CrossIcon/>;
		case PicklistScanStatus.NOT_COMPLETE:
			return <WarnIcon/>;
	}
};

const PickListItem: React.FC<Picklist> = ({ picklistId, rampName, shipmentType, scanStatus }) => {
	const [showTip, setTip] = useState<boolean>(false);
	const { t } = useAppContext();
	return (
		<Tooltip
			isVisible={showTip}
			content={
				<TooltipContainer>
					<IconByStatus status={scanStatus}/>
					<TooltipText>{t(PicklistScanStatus[scanStatus])}</TooltipText>
				</TooltipContainer>
			}
			placement="top"
			onClose={() => setTip(false)}
			disableShadow={true}
			backgroundColor={'none'}
			topAdjustment={Platform.OS === 'android' ? -(StatusBar.currentHeight || 0) + 15 : 15}
			showChildInTooltip={false}
			contentStyle={{ borderColor: getColorByStatus(scanStatus), borderWidth: 1 }}
			arrowStyle={{ display: 'none' }}
			displayInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
		>
			<TouchableHighlight activeOpacity={0.4} underlayColor={Colors.primary} onPress={() => setTip(true)}>
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
						<IconByStatus status={scanStatus}/>
					</View>
				</ListItemWrapper>
			</TouchableHighlight>
		</Tooltip>
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
