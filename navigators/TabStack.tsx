/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, StyledContainer } from '../components/styles';

import RouteNames from './../constants/route.names';
import NetworkLogger from 'react-native-network-logger';
import Constants from 'expo-constants';

const Login = React.lazy(() => import('./../screens/Login'));
const Settings = React.lazy(() => import('./../screens/Settings'));


const Tabs = createBottomTabNavigator();

const NetworkLoggerContainer = () => <StyledContainer>
	<NetworkLogger/>
</StyledContainer>;

const TabStackScreen: React.FC = () => {
	return <Tabs.Navigator
		initialRouteName={RouteNames.LOGIN}
		screenOptions={({ route }) => ({
			tabBarIcon: ({ focused, color, size }) => {
				const iconName = route.name === RouteNames.LOGIN
					? 'log-in-outline'
					: route.name === RouteNames.SETTINGS ? 'settings-outline' : 'key';
				return <Ionicons name={iconName} size={size} color={color}/>;
			},
			headerStyle: { backgroundColor: 'transparent' },
			headerTintColor: Colors.tertiary,
			headerTransparent: true,
			headerTitle: '',
			tabBarActiveTintColor: '#8dbf4c',
			tabBarStyle: { position: 'absolute' },
		})}
	>
		<Tabs.Screen name={RouteNames.LOGIN} component={Login}/>
		<Tabs.Screen name={RouteNames.SETTINGS} component={Settings}/>
		{/*TODO remove NetworkLogger*/}
		{Constants.manifest?.extra?.isDevMode &&
		<Tabs.Screen name={RouteNames.WELCOME} component={NetworkLoggerContainer}/>}
	</Tabs.Navigator>;
};

export default TabStackScreen;