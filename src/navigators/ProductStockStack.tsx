/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteNames from '../constants/route.names';
import FindProductScreen from '../screens/FindProductScreen';
import ProductStockListScreen from '../screens/ProductStockListScreen';
import CreateStockRecordScreen from '../screens/CreateStockRecordScreen';

const Stack = createNativeStackNavigator();

// @ts-ignore
const ProductStockStack = () => {
	return (
		<Stack.Navigator initialRouteName={RouteNames.FIND_PRODUCT} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={RouteNames.FIND_PRODUCT} component={FindProductScreen} />
			<Stack.Screen name={RouteNames.PRODUCT_STOCK_LIST} component={ProductStockListScreen} />
			<Stack.Screen name={RouteNames.CREATE_STOCK_RECORD} component={CreateStockRecordScreen} />
		</Stack.Navigator>
	);
};

export default ProductStockStack;
