/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import TextInput from '../components/TextInput';
import {
	ButtonText,
	Colors,
	ErrorMsgBox,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	SubTitle,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Formik } from 'formik';
import { getData, STORAGE_KEYS, storeData } from '../services/AsyncStorageOperations';
import api, { ConnectionProperties } from '../api/Communicator';
import RouteNames from '../constants/route.names';
import useAppContext from '../context/AppContext';
import LanguageSelect from '../components/LanguageSelect';
import Constants from 'expo-constants';

// @ts-ignore
const Settings = ({ navigation }) => {
	const { t } = useAppContext();
	const [connectionProperties, setConnectionProperties] = useState<ConnectionProperties>({
		host: '',
		port: '',
		contextPath: '',
	});

	const [isValidConnectionProperties, setConnectionPropertiesValidity] = useState<boolean>(false);

	useEffect(() => {
		getData(STORAGE_KEYS.CONNECTION_PROPERTIES).then(async (res: string) => {
			if (res) {
				const result: ConnectionProperties = JSON.parse(res);
				await validateConnectionProperties(result);
				setConnectionProperties(result);
			}
		});
	}, []);

	const validateConnectionProperties = useCallback(async (properties: ConnectionProperties) => {
		try {
			await api.ping(properties);
			setConnectionPropertiesValidity(true);
			return true;
		} catch (error) {
			setConnectionPropertiesValidity(false);
			return false;
		}
	}, []);

	const handleSubmit = useCallback(async (properties: ConnectionProperties) => {
		await storeData(STORAGE_KEYS.CONNECTION_PROPERTIES, properties);
		properties && api.saveConnectionProperties(properties);
		await navigation.navigate(RouteNames.LOGIN);
	}, []);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={false}>
				<InnerContainer>
					<SubTitle>{t('CONNECTION_PROPERTIES')}</SubTitle>
					<Formik
						enableReinitialize={true}
						initialValues={connectionProperties}
						onSubmit={(properties: ConnectionProperties) => {
							validateConnectionProperties(properties).then((isValid) => {
								isValid && handleSubmit(properties);
							});
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => {
							// @ts-ignore
							return (
								<StyledFormArea>
									<TextInput
										label={t('HOST')}
										icon={''}
										placeholder={'http://127.0.0.1'}
										placeholderTextColor={Colors.darkLight}
										onChangeText={handleChange('host')}
										onBlur={handleBlur('host')}
										value={values.host}
										keyboardType={'url'}
									/>
									<TextInput
										label={t('PORT')}
										icon={''}
										placeholder={'8080'}
										placeholderTextColor={Colors.darkLight}
										onChangeText={handleChange('port')}
										onBlur={handleBlur('port')}
										value={values.port}
										keyboardType={'numeric'}
									/>
									<TextInput
										label={t('CONTEXT_PATH')}
										icon={''}
										placeholder={'whapp'}
										placeholderTextColor={Colors.darkLight}
										onChangeText={handleChange('contextPath')}
										onBlur={handleBlur('contextPath')}
										value={values.contextPath}
										keyboardType={'default'}
									/>
									{!isValidConnectionProperties && (
										<ErrorMsgBox onPress={() => navigation.navigate(RouteNames.SETTINGS)}>
											{t('SET_VALID_CONNECTION_PROPERTIES')}
										</ErrorMsgBox>
									)}
									<StyledButton onPress={handleSubmit}>
										<ButtonText>{t('SAVE')}</ButtonText>
									</StyledButton>
									<ErrorMsgBox color={'#4d4d4d'}>
										Build version: {Constants?.manifest?.version}
									</ErrorMsgBox>
								</StyledFormArea>
							);
						}}
					</Formik>
					<LanguageSelect />
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Settings;
