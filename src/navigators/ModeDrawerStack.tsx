/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	useDrawerProgress,
} from '@react-navigation/drawer';
import useAppContext from '../context/AppContext';
import LabelingStack from './LabelingStack';
import RouteNames from '../constants/route.names';
// @ts-ignore
import Animated, { AnimatedNode } from 'react-native-reanimated';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SecondaryButtonText, SecondaryStyledButton } from '../components/styles';
import useAppAuthContext from '../context/AppAuthContext';
import Constants from 'expo-constants';
import HomeScreen from '../screens/HomeScreen';
import ProductionStack from './ProductionStack';
import BarcodeAssignmentStack from './BarcodeAssignmentStack';
import ProductStockStack from './ProductStockStack';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...rest }: { [key: string]: any }) => {
	const { authActions } = useAppAuthContext();
	const { t } = useAppContext();
	const progress: any = useDrawerProgress();

	const translateX = Animated.interpolateNode(progress, {
		inputRange: [0, 1],
		outputRange: [-100, 0],
	});

	return (
		<DrawerContentScrollView {...rest} style={{ height: '100%' }}>
			<Animated.View style={style(translateX).animate}>
				<View>
					<DrawerItemList navigation={rest.navigation} state={rest.state} descriptors={rest.descriptors} />
				</View>
				<View style={{ paddingRight: 10, paddingLeft: 10, paddingBottom: 10 }}>
					<SecondaryStyledButton onPress={async () => await authActions.signOut()} lastButton={true}>
						<SecondaryButtonText>{t('LOGOUT')}</SecondaryButtonText>
					</SecondaryStyledButton>
				</View>
			</Animated.View>
		</DrawerContentScrollView>
	);
};

const ModeDrawerStack = () => {
	const { t } = useAppContext();
	console.log('HomeScreen', HomeScreen);
	return (
		<>
			<Drawer.Navigator
				initialRouteName={RouteNames.HOME}
				useLegacyImplementation
				screenOptions={{
					drawerStyle: { width: '75%' },
					drawerActiveBackgroundColor: '#8DBF4C',
					drawerActiveTintColor: '#EDF5E3',
					keyboardDismissMode: 'none',
				}}
				drawerContent={(props: { [key: string]: any }) => <CustomDrawerContent {...props} />}
			>
				<Drawer.Screen name={RouteNames.HOME} component={HomeScreen} options={{ title: t('HOME') }} />
				<Drawer.Screen
					name={RouteNames.LABELING_STACK}
					component={LabelingStack}
					options={{ title: t('SCANNING') }}
				/>
				<Drawer.Screen
					name={RouteNames.PRODUCTION_STACK}
					component={ProductionStack}
					options={{ title: t('PRODUCTION') }}
				/>
				<Drawer.Screen
					name={RouteNames.BARCODE_ASSIGNMENT_STACK}
					component={BarcodeAssignmentStack}
					options={{ title: t('BARCODE_ASSIGNMENT') }}
				/>
				<Drawer.Screen
					name={RouteNames.PRODUCT_STOCK_STACK}
					component={ProductStockStack}
					options={{ title: t('PRODUCT_STOCK') }}
				/>
			</Drawer.Navigator>
		</>
	);
};

const style = (translateX: AnimatedNode<number>) =>
	StyleSheet.create({
		animate: {
			transform: [{ translateX }],
			position: 'relative',
			display: 'flex',
			justifyContent: 'space-between',
			height: Dimensions.get('screen').height - Constants.statusBarHeight - 50,
		},
	});

export default ModeDrawerStack;
