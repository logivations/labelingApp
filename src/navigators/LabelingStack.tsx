/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import LabelingScreen from '../screens/LabelingScreen';
import PickListsScreen from '../screens/PickListsScreen';

const Stack = createNativeStackNavigator();

// @ts-ignore
const LabelingStack = ({ navigation: drawerNavigator }) => {
	return (
		<Stack.Navigator initialRouteName={RouteNames.LABELING} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={RouteNames.LABELING} component={LabelingScreen}/>
			<Stack.Screen name={RouteNames.PICK_LISTS}>
				{({ navigation: stackNavigation }) => (
					<PickListsScreen stackNavigation={stackNavigation} drawerNavigator={drawerNavigator}/>
				)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default LabelingStack;
