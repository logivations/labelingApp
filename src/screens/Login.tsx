/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';

import TextInput from '../components/TextInput';
import {
	ButtonText,
	Colors,
	ErrorMsgBox,
	InnerContainer,
	PageTitle,
	RightIcon,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	SubTitle,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import Communicator from '../api/Communicator';
import RouteNames from '../constants/route.names';
import useAppContext from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import useAppAuthContext from '../context/AppAuthContext';

// @ts-ignore
const Login = ({ navigation }) => {
	const { authActions } = useAppAuthContext();

	const { t } = useAppContext();
	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
	const [isConnectionPropertiesExist, setIsConnectionPropertiesExist] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setIsConnectionPropertiesExist(Communicator.isExistConnectionProperties);
		}, 500);
		return navigation.addListener('focus', () => {
			setIsConnectionPropertiesExist(Communicator.isExistConnectionProperties);
		});
	}, []);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={false}>
				<InnerContainer>
					<PageTitle>{t('W2MO_SCANNER_APP')}</PageTitle>
					<SubTitle>{t('LOG_IN_TO_CONTINUE')}</SubTitle>

					<Formik
						initialValues={{ email: 'admin', password: '23mOHi,' }}
						onSubmit={async (val) => {
							await authActions.signIn(val.email, val.password, setLoginErrorMessage);
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => (
							<StyledFormArea>
								<TextInput
									authInput={true}
									label={t('LOGIN')}
									icon={'person'}
									placeholder={'w2mo@logivations.com'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
									value={values.email}
									keyboardType={'email-address'}
									editable={isConnectionPropertiesExist}
								/>
								<TextInput
									authInput={true}
									label={t('PASSWORD')}
									icon={'lock'}
									placeholder={'* * * * * * * *'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									value={values.password}
									secureTextEntry={hidePassword}
									isPassword={true}
									editable={isConnectionPropertiesExist}
									rightIcon={
										<RightIcon onPress={() => setHidePassword && setHidePassword(!hidePassword)}>
											<Ionicons
												size={30}
												color={Colors.darkLight}
												name={hidePassword ? 'md-eye-off' : 'md-eye'}
											/>
										</RightIcon>
									}
								/>
								{loginErrorMessage && <ErrorMsgBox>{loginErrorMessage}</ErrorMsgBox>}
								{!isConnectionPropertiesExist && (
									<ErrorMsgBox onPress={() => navigation.navigate(RouteNames.SETTINGS)}>
										{t('SET_FIRST_CONNECTION_PROPERTIES')}
									</ErrorMsgBox>
								)}
								<StyledButton onPress={handleSubmit} disabled={!isConnectionPropertiesExist}>
									<ButtonText>{t('LOGIN')}</ButtonText>
								</StyledButton>
							</StyledFormArea>
						)}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Login;
