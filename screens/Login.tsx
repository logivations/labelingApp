/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import TextInput from './../components/TextInput';
import {
	ButtonText,
	Colors,
	ErrorMsgBox,
	InnerContainer,
	PageTitle,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	SubTitle,
} from '../components/styles';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
import Communicator from './../api/Communicator';
import RouteNames from '../constants/route.names';
import useAppContext from '../AppContext';


// @ts-ignore
const Login = ({ navigation }) => {
	const { checkIsSignedIn } = useAppContext();
	const [isSignInning, setSingInning] = useState<boolean>(false);
	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
	const [isConnectionPropertiesExist, setIsConnectionPropertiesExist] = useState<boolean>(false);

	useEffect(() => {
		setIsConnectionPropertiesExist(Communicator.isExistConnectionProperties);
		return navigation.addListener('focus', () => {
			setIsConnectionPropertiesExist(Communicator.isExistConnectionProperties);
		});
	}, []);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
				<InnerContainer>
					<PageTitle>Scanning App</PageTitle>
					<SubTitle>Please Login!</SubTitle>

					<Formik
						initialValues={{ email: 'admin', password: '23mOHi,' }}
						onSubmit={(val) => {
							setSingInning(true);
							Communicator.login(val.email, val.password).then((result) => {
								result && setLoginErrorMessage(
									result.hasOwnProperty('errorMessage')
										? result.errorMessage
										: null,
								);
								checkIsSignedIn(() => setSingInning(false));
							});
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => <StyledFormArea>
							<TextInput
								label={'Email Address'}
								icon={'mail'}
								placeholder={'w2mo@logivations.com'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								value={values.email}
								keyboardType={'email-address'}
								editable={isConnectionPropertiesExist}
							/>
							<TextInput
								label={'Password'}
								icon={'lock'}
								placeholder={'* * * * * * * *'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								value={values.password}
								secureTextEntry={hidePassword}
								isPassword={true}
								hidePassword={hidePassword}
								setHidePassword={setHidePassword}
								editable={isConnectionPropertiesExist}
							/>
							{loginErrorMessage && <ErrorMsgBox>{loginErrorMessage}</ErrorMsgBox>}
							{!isConnectionPropertiesExist &&
							<ErrorMsgBox onPress={() => navigation.navigate(RouteNames.SETTINGS)}>
								Set first connection properties in Settings
							</ErrorMsgBox>}
							<StyledButton onPress={handleSubmit} disabled={!isConnectionPropertiesExist}>
								<ButtonText>{isSignInning ? 'SignIn...' : 'Login'}</ButtonText>
							</StyledButton>
						</StyledFormArea>}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Login;
