/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useEffect, useState } from 'react';
import TextInput from './../components/TextInput';
import {
	ButtonText,
	Colors,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Formik } from 'formik';
import { getData, STORAGE_KEYS, storeData } from '../services/AsyncStorageOperations';
import api, { ConnectionProperties } from '../api/Communicator';

const Settings = () => {
	const [connectionProperties, setConnectionProperties] = useState<ConnectionProperties>({
		host: '',
		port: '',
		contextPath: '',
	});

	useEffect(() => {
		getData(STORAGE_KEYS.CONNECTION_PROPERTIES).then((res: string) => {
			if (res) {
				const result: ConnectionProperties = JSON.parse(res);
				setConnectionProperties(result);
			}
		});
	}, []);
	return <KeyboardAvoidingWrapper>
		<StyledContainer>
			<InnerContainer>
				<Formik
					enableReinitialize={true}
					initialValues={connectionProperties}
					onSubmit={async (properties: ConnectionProperties) => {
						await storeData(STORAGE_KEYS.CONNECTION_PROPERTIES, properties);
						properties && api.saveConnectionProperties(properties);
					}}
				>
					{({ handleChange, handleBlur, handleSubmit, values }) => {
						return <StyledFormArea>
							<TextInput
								label={'Host'}
								icon={''}
								placeholder={'127.0.0.1'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('host')}
								onBlur={handleBlur('host')}
								value={values.host}
								keyboardType={'url'}
							/>
							<TextInput
								label={'Port'}
								icon={''}
								placeholder={'8080'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('port')}
								onBlur={handleBlur('port')}
								value={values.port}
								keyboardType={'numeric'}
							/>
							<TextInput
								label={'Context path'}
								icon={''}
								placeholder={'whapp'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={handleChange('contextPath')}
								onBlur={handleBlur('contextPath')}
								value={values.contextPath}
								keyboardType={'default'}
							/>
							<StyledButton onPress={handleSubmit}>
								<ButtonText>Save</ButtonText>
							</StyledButton>
						</StyledFormArea>;
					}}
				</Formik>
			</InnerContainer>
		</StyledContainer>
	</KeyboardAvoidingWrapper>;
};

export default Settings;