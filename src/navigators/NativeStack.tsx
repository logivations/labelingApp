/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import Labeling from '../screens/Labeling';
import PickListsScreen from '../screens/PickListsScreen';

const Stack = createNativeStackNavigator();

const LabelingStack = () => {
	return (
		<Stack.Navigator initialRouteName={RouteNames.LABELING} screenOptions={{ headerShown: true }}>
			<Stack.Screen name={RouteNames.LABELING} component={Labeling}/>
			<Stack.Screen name={RouteNames.PICK_LISTS} component={PickListsScreen}/>
		</Stack.Navigator>
	);
};

export default LabelingStack;
