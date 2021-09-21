/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Picklist from '../models/Picklist';
import { Colors } from './styles';

const PickListItem: React.FC<Picklist> = ({ picklistId, rampName, shipmentType }) => {
	return <View style={styles.listItem}>
		<Text>{picklistId}</Text>
		<Text>{rampName}</Text>
		<Text>{shipmentType}</Text>
	</View>;
};

const styles = StyleSheet.create({
	listItem: {
		flex: 1,
		//width: '100%',
		margin: 10,
		borderStyle: 'solid',
		borderColor: Colors.secondary,
		borderWidth: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
});

export default PickListItem;
