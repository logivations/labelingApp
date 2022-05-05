/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import { DeviceEventEmitter } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
	ButtonGroup,
	ButtonText,
	Colors,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	StyledInputLabel,
	StyledTextInput,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
// @ts-ignore
import useAppContext from '../context/AppContext';
import { Formik } from 'formik';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';

const valueValidation = (value: number, charsBeforeComma: number): boolean => {
	console.log('value', value);
	const [valBeforeComma, valAfterComma] = String(value).split(',');
	return valAfterComma
		? valBeforeComma.length < charsBeforeComma && valAfterComma.length < 5
		: valBeforeComma.length < charsBeforeComma;
};
// @ts-ignore
const CreateProductScreen = ({ route, navigation }) => {
	const { t } = useAppContext();
	const [product, setProduct] = useState<{ [key: string]: any }>({
		name: '',
		description: '',
		sizeX: null,
		sizeY: null,
		sizeZ: null,
		weight: null,
	});

	const setProductProperty = useCallback((propName, value) => {
		setProduct((product) => ({ ...product, [propName]: value }));
	}, []);

	const parsedProduct = useMemo<any>(() => {
		return Object.keys(product).reduce((obj: { [key: string]: any }, key: string) => {
			const value = ['name', 'description'].includes(key) ? product[key] : parseFloat(product[key]);
			return value ? { ...obj, [key]: value } : obj;
		}, {});
	}, [product]);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<StyledInputLabel>{t('CREATE_NEW_PRODUCT')}</StyledInputLabel>
					<Formik
						enableReinitialize={true}
						initialValues={{
							name: product.name,
							description: product.description,
							sizeX: product.sizeX,
							sizeY: product.sizeY,
							sizeZ: product.sizeZ,
							weight: product.weight,
						}}
						validateOnChange={true}
						validate={(values) => {
							const errors: { [key: string]: boolean } = {};
							values.name.length > 24 && (errors['name'] = true);
							values.description.length > 64 && (errors['description'] = true);
							!valueValidation(values.sizeX, 7) && (errors['sizeX'] = true);
							!valueValidation(values.sizeY, 7) && (errors['sizeY'] = true);
							!valueValidation(values.sizeZ, 7) && (errors['sizeZ'] = true);
							!valueValidation(values.weight, 11) && (errors['weight'] = true);
							return errors;
						}}
						onSubmit={async () => {
							try {
								const createdProduct = await Communicator.createProduct(parsedProduct);
								console.log('createdProduct', createdProduct);
								DeviceEventEmitter.emit('setSelectedProduct', createdProduct);
								Toast.show({
									title: t('PRODUCT_CREATED_SUCCESSFULLY'),
									color: Colors.green,
									timing: 5000,
								});
								navigation.goBack();
							} catch (error) {
								Toast.show({ title: error.message, color: Colors.red, timing: 5000 });
							}
						}}
					>
						{({ errors, handleChange, handleSubmit, handleBlur, values }) => {
							console.log('errors', errors);
							return (
								<StyledFormArea>
									<StyledTextInput
										label={t('PRODUCT_NAME')}
										placeholder={`${t('PRODUCT_NAME')} *`}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('name', value);
											handleChange('name')(value);
										}}
										isInvalid={!!errors.name}
										value={values.name}
										blurOnSubmit={false}
										editable={true}
										icon={null}
									/>
									<StyledTextInput
										label={t('PRODUCT_DESCRIPTION')}
										placeholder={t('PRODUCT_DESCRIPTION')}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('description', value);
											handleChange('description')(value);
										}}
										isInvalid={!!errors.description}
										value={values.description}
										blurOnSubmit={false}
										editable={true}
										icon={null}
									/>
									<StyledTextInput
										label={t('SIZE_X')}
										placeholder={t('SIZE_X')}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('sizeX', value);
											handleChange('sizeX')(value);
										}}
										isInvalid={!!errors.sizeX}
										value={values.sizeX}
										blurOnSubmit={false}
										editable={true}
										keyboardType={'numeric'}
										icon={null}
									/>
									<StyledTextInput
										label={t('SIZE_Y')}
										placeholder={t('SIZE_Y')}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('sizeY', value);
											handleChange('sizeY')(value);
										}}
										isInvalid={!!errors.sizeY}
										value={values.sizeY}
										blurOnSubmit={false}
										editable={true}
										keyboardType={'numeric'}
										icon={null}
									/>
									<StyledTextInput
										label={t('SIZE_Z')}
										placeholder={t('SIZE_Z')}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('sizeZ', value);
											handleChange('sizeZ')(value);
										}}
										isInvalid={!!errors.sizeZ}
										value={values.sizeZ}
										blurOnSubmit={false}
										editable={true}
										keyboardType={'numeric'}
										icon={null}
									/>
									<StyledTextInput
										label={t('WEIGHT')}
										placeholder={t('WEIGHT')}
										placeholderTextColor={Colors.darkLight}
										onChangeText={(value: string) => {
											setProductProperty('weight', value);
											handleChange('weight')(value);
										}}
										isInvalid={!!errors.weight}
										value={values.weight}
										blurOnSubmit={false}
										editable={true}
										keyboardType={'numeric'}
										icon={null}
									/>
									<ButtonGroup>
										<StyledButton
											onPress={() => navigation.goBack()}
											disabled={false}
											minWidth={'48%'}
											lastButton={false}
										>
											<ButtonText>{t('BACK')}</ButtonText>
										</StyledButton>
										<StyledButton
											onPress={handleSubmit}
											disabled={!values.name || Object.values(errors).some((invalid) => invalid)}
											minWidth={'48%'}
											lastButton={true}
										>
											<ButtonText>{t('OK')}</ButtonText>
										</StyledButton>
									</ButtonGroup>
								</StyledFormArea>
							);
						}}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default CreateProductScreen;
