/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
	ButtonGroup,
	ButtonText,
	InnerContainer,
	PageTitle,
	StyledButton,
	StyledContainer,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
// @ts-ignore
import ScannerIcon from './../../assets/icons/app-icon.svg';
import useAppContext from '../context/AppContext';
import RouteNames from '../constants/route.names';

// @ts-ignore
const HomeScreen = ({ navigation: drawerNavigator }) => {
	const { t } = useAppContext();
	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer style={styles.container}>
					<View style={styles.iconContainer}>
						<ScannerIcon/>
					</View>
					<View>
						<Text style={styles.subTitle}>{t('WELCOME_TO')}:</Text>
						<PageTitle style={styles.title}>{t('W2MO_SCANNER_APP')}</PageTitle>
					</View>
					<View>
						<Text style={styles.subTitle}>{t('PLEASE_CHOOSE_THE_MODE')}:</Text>
						<View style={styles.buttonGroupContainer}>
							<ButtonGroup>
								<StyledButton
									onPress={() => drawerNavigator.navigate(RouteNames.LABELING_STACK)}
									disabled={false}
									minWidth={'48%'}
								>
									<ButtonText>{t('LABELING_MODE')}</ButtonText>
								</StyledButton>
								<StyledButton
									onPress={() => drawerNavigator.navigate(RouteNames.PRODUCTION_STACK)}
									disabled={false}
									minWidth={'48%'}
									lastButton={true}
								>
									<ButtonText>{t('PRODUCTION_MODE')}</ButtonText>
								</StyledButton>
							</ButtonGroup>
						</View>
					</View>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};


const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	iconContainer: {
		width: 48,
		height: 48,
	},
	title: {
		marginTop: 0,
	},
	subTitle: {
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center',
		marginBottom: -8,
		marginTop: 14,
	},
	buttonGroupContainer: {
		marginTop: 30,
	},
});


export default HomeScreen;
