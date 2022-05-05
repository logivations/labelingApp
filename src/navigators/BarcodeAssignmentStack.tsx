/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import BarcodeAssignmentScreen from '../screens/BarcodeAssignmentScreen';
import CreateProductScreen from '../screens/CreateProductScreen';

const Stack = createNativeStackNavigator();

// @ts-ignore
const BarcodeAssignmentStack = () => {
	return (
		<Stack.Navigator initialRouteName={RouteNames.SCAN_PRODUCT} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={RouteNames.SCAN_PRODUCT} component={BarcodeAssignmentScreen} />
			<Stack.Screen name={RouteNames.CREATE_PRODUCT} component={CreateProductScreen} />
		</Stack.Navigator>
	);
};

export default BarcodeAssignmentStack;
