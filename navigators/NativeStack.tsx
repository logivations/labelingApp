/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import Labeling from '../screens/Labeling';
import ScanningScreen from '../screens/ScanningModal';

const Stack = createNativeStackNavigator();

const LabelingStack = () => {
	return (
		<Stack.Navigator
			initialRouteName={RouteNames.LABELING}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name={RouteNames.LABELING} component={Labeling}/>
			<Stack.Screen name={RouteNames.SCANNING} component={ScanningScreen}/>
		</Stack.Navigator>
	);
};

export default LabelingStack;