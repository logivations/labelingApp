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
import useAppContext from '../../AppContext';
import { Ionicons } from '@expo/vector-icons';


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
					<PageTitle>Labeling App</PageTitle>
					<SubTitle>Log In to continue</SubTitle>

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
							}).finally(() => setSingInning(false));
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => <StyledFormArea>
							<TextInput
								authInput={true}
								label={'Login'}
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
								label={'Password'}
								icon={'lock'}
								placeholder={'* * * * * * * *'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								value={values.password}
								secureTextEntry={hidePassword}
								isPassword={true}
								editable={isConnectionPropertiesExist}
								rightIcon={<RightIcon onPress={() => setHidePassword && setHidePassword(!hidePassword)}>
									<Ionicons
										size={30}
										color={Colors.darkLight}
										name={hidePassword ? 'md-eye-off' : 'md-eye'}
									/>
								</RightIcon>}
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