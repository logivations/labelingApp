/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Suspense } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabStackScreen from './TabStack';
import useAppAuthContext from '../context/AppAuthContext';
import ModeDrawerStack from './ModeDrawerStack';
import useAppContext from '../context/AppContext';

const RootStack: React.FC = () => {
	const { t } = useAppContext();
	const {
		authState: { userToken },
	} = useAppAuthContext();
	return (
		<Suspense fallback={<Text>{t('LOADING')}...</Text>}>
			<NavigationContainer>{userToken === null ? <TabStackScreen /> : <ModeDrawerStack />}</NavigationContainer>
		</Suspense>
	);
};

export default RootStack;
