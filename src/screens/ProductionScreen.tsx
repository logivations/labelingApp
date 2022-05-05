/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import {
	ButtonGroup,
	ButtonText,
	Colors,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import React, { useLayoutEffect } from 'react';
import useAppContext from '../context/AppContext';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import StyledTextInput from './../components/TextInput';
import { Formik } from 'formik';
import useProduction from '../hooks/useProduction';

// @ts-ignore
const ProductionScreen = ({ route, stackNavigation, drawerNavigator }) => {
	const { t } = useAppContext();
	const { selectedBin } = route.params;

	const {
		eanOld,
		eanNew,
		sn,
		setEanOld,
		setEanNew,
		setSn,
		eanOldRef,
		eanNewRef,
		snRef,
		clearTextFields,
		createNewDocument,
		readyForProductionAction,
		fillProductionController,
	} = useProduction(stackNavigation, selectedBin);

	useLayoutEffect(() => {
		stackNavigation.setOptions({ headerShown: true, title: t('PRODUCTION') });
		drawerNavigator.setOptions({ headerShown: false });
		return () => {
			drawerNavigator.setOptions({ headerShown: true });
		};
	}, [stackNavigation, drawerNavigator]);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{ eanOld, eanNew, sn }}
						onSubmit={async () => {
							await fillProductionController.createDocument(
								{ eanOld, eanNew, sn },
								clearTextFields,
								selectedBin,
							);
						}}
					>
						{({ handleChange, handleSubmit, handleBlur, values }) => (
							<StyledFormArea>
								<StyledTextInput
									label={t('EAN_OLD')}
									placeholder={t('EAN_OLD')}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										if (Math.abs(value.length - values.eanOld.length) === 1) {
											setEanOld(value);
											handleChange('eanOld')(value);
										}
									}}
									onTextInput={async (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onSubmitEditing(
											'eanOld',
											'eanNew',
											value,
											handleBlur,
										);
									}}
									reference={eanOldRef}
									value={values.eanOld}
									blurOnSubmit={false}
									editable={true}
									icon={null}
								/>
								<StyledTextInput
									label={t('EAN_NEW')}
									placeholder={t('EAN_NEW')}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										if (Math.abs(value.length - values.eanNew.length) === 1) {
											setEanNew(value);
											handleChange('eanNew')(value);
										}
									}}
									onTextInput={async (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onSubmitEditing(
											'eanNew',
											'sn',
											value,
											handleBlur,
										);
									}}
									value={values.eanNew}
									blurOnSubmit={false}
									icon={null}
								/>
								<StyledTextInput
									label={'SN'}
									placeholder={'SN'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										if (Math.abs(value.length - values.sn.length) === 1) {
											setSn(value);
											handleChange('sn')(value);
										}
									}}
									onTextInput={async (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillProductionController.onSubmitEditing(
											'sn',
											'eanOld',
											value,
											handleBlur,
											async () => {
												if (fillProductionController.isManualInput) {
													await fillProductionController.createDocument(
														{ eanOld, eanNew, sn },
														clearTextFields,
													);
												} else {
													clearTextFields();
												}
											},
										);
									}}
									value={values.sn}
									blurOnSubmit={false}
									icon={null}
								/>

								<ButtonGroup>
									<StyledButton
										onPress={handleSubmit}
										disabled={!eanOld || !eanNew || !sn}
										minWidth={'100%'}
										lastButton={true}
									>
										<ButtonText>{t('OK')}</ButtonText>
									</StyledButton>
								</ButtonGroup>
							</StyledFormArea>
						)}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default ProductionScreen;
