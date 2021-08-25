/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { Suspense } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabStackScreen from './TabStack';
import useAppContext from '../AppContext';
import { InnerContainer, StyledContainer } from '../components/styles';


const Login = React.lazy(() => import('./../screens/Login'));
const Settings = React.lazy(() => import('./../screens/Settings'));
const Welcome = React.lazy(() => import('./../screens/Welcome'));

// const Stack = createNativeStackNavigator();

const RootStack = () => {
	const { isSignedIn, isLoading } = useAppContext();
	return (
		<NavigationContainer>
			{isLoading ? (
				<StyledContainer>
					<InnerContainer>
						<Text>Loading...</Text>
					</InnerContainer>
				</StyledContainer>
			) : (
				<Suspense fallback={<Text>Loading...</Text>}>
					{isSignedIn ? (
						<>
							<Welcome/>
						</>
					) : (
						<>
							<TabStackScreen/>
						</>
					)}
				</Suspense>
			)}
		</NavigationContainer>

	);
};

export default RootStack;