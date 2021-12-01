/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Suspense } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabStackScreen from './TabStack';
import useAppContext from '../context/AppContext';
import { InnerContainer, StyledContainer } from '../components/styles';
import LabelingStack from './NativeStack';

const RootStack: React.FC = () => {
	const { isSignedIn, isLoading, t } = useAppContext();
	return (
		<NavigationContainer>
			{isLoading ? (
				<StyledContainer>
					<InnerContainer>
						<Text>{t('LOADING')}...</Text>
					</InnerContainer>
				</StyledContainer>
			) : (
				<Suspense fallback={<Text>{t('LOADING')}...</Text>}>
					{isSignedIn ? <LabelingStack/> : <TabStackScreen/>}
				</Suspense>
			)}
		</NavigationContainer>
	);
};

export default RootStack;
