/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import InputProductionScreen from '../screens/InputProductionScreen';
import ProductionScreen from '../screens/ProductionScreen';

const Stack = createNativeStackNavigator();

// @ts-ignore
const ProductionStack = ({ navigation: drawerNavigator }) => {
	return (
		<Stack.Navigator initialRouteName={RouteNames.INPUT_PRODUCTION} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={RouteNames.INPUT_PRODUCTION} component={InputProductionScreen}/>
			<Stack.Screen name={RouteNames.PRODUCTION}>
				{({ navigation: stackNavigation, ...rest }) => (
					<ProductionScreen stackNavigation={stackNavigation} drawerNavigator={drawerNavigator} {...rest} />
				)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default ProductionStack;
