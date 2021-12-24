/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { SyntheticEvent } from 'react';

import {
	ButtonGroup,
	ButtonText,
	Colors,
	InnerContainer,
	LabelingErrorMsgBox,
	SecondaryButtonText,
	SecondaryStyledButton,
	StyledButton,
	StyledContainer,
	StyledFormArea,
} from '../components/styles';
import useAppContext from '../context/AppContext';
import { Formik } from 'formik';
import StyledTextInput from '../components/TextInput';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import useLabeling from '../hooks/useLabeling';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

// @ts-ignore
const LabelingScreen = ({ navigation }) => {
	const { t } = useAppContext();
	const {
		nve,
		ean,
		sn,
		setNve,
		setEan,
		setSn,
		nveRef,
		eanRef,
		snRef,
		clearTextFields,
		readyForLoadingAction,
		fillLabelingController,
	} = useLabeling(navigation);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{ nve, ean, sn }}
						onSubmit={async () => {
							await fillLabelingController.createDocument({ nve, ean, sn }, clearTextFields);
						}}
					>
						{({ handleChange, handleSubmit, handleBlur, values }) => (
							<StyledFormArea>
								<StyledTextInput
									label={'NVE'}
									placeholder={'NVE'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										if (Math.abs(value.length - values.nve.length) === 1) {
											setNve(value);
											handleChange('nve')(value);
										}
									}}
									onTextInput={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
										fillLabelingController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillLabelingController.onSubmitEditing('nve', 'ean', value, handleBlur);
									}}
									reference={nveRef}
									value={values.nve}
									blurOnSubmit={false}
									editable={true}
									icon={null}
								/>
								<StyledTextInput
									label={'EAN'}
									placeholder={'EAN'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										if (Math.abs(value.length - values.ean.length) === 1) {
											setEan(value);
											handleChange('ean')(value);
										}
									}}
									onTextInput={async (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillLabelingController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: SyntheticEvent) => {
										await fillLabelingController.onSubmitEditing('ean', 'sn', value, handleBlur);
									}}
									reference={eanRef}
									value={values.ean}
									editable={!!nve}
									disabled={!nve}
									blurOnSubmit={false}
									icon={null}
								/>
								{!nve && <LabelingErrorMsgBox>{t('PLEASE_FILL_NVE_FIRST')}</LabelingErrorMsgBox>}
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
										await fillLabelingController.onTextInput(
											event.nativeEvent.text,
											clearTextFields,
										);
									}}
									onSubmitEditing={async (value: NativeSyntheticEvent<TextInputFocusEventData>) => {
										await fillLabelingController.onSubmitEditing(
											'sn',
											'nve',
											value,
											handleBlur,
											async () => {
												if (fillLabelingController.isManualInput) {
													await fillLabelingController.createDocument(
														{ nve, ean, sn },
														clearTextFields,
													);
												} else {
													clearTextFields();
												}
											},
										);
									}}
									reference={snRef}
									value={values.sn}
									editable={!!nve && !!ean}
									disabled={!nve || !ean}
									blurOnSubmit={false}
									icon={null}
								/>
								{!ean && !nve && (
									<LabelingErrorMsgBox>{t('PLEASE_FILL_EAN_AND_NVE_FIRST')}</LabelingErrorMsgBox>
								)}
								{!ean && !!nve && (
									<LabelingErrorMsgBox>{t('PLEASE_FILL_EAN_FIRST')}</LabelingErrorMsgBox>
								)}
								<ButtonGroup>
									<SecondaryStyledButton onPress={clearTextFields} disabled={false} minWidth={'48%'}>
										<SecondaryButtonText>{t('CLEAR')}</SecondaryButtonText>
									</SecondaryStyledButton>
									<StyledButton
										onPress={handleSubmit}
										disabled={!nve || !ean || !sn}
										minWidth={'48%'}
										lastButton={true}
									>
										<ButtonText>{t('OK')}</ButtonText>
									</StyledButton>
								</ButtonGroup>
								<SecondaryStyledButton onPress={readyForLoadingAction} minWidth={'45%'}
													   lastButton={true}>
									<SecondaryButtonText>{t('READY_FOR_LOADING')}</SecondaryButtonText>
								</SecondaryStyledButton>
							</StyledFormArea>
						)}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default LabelingScreen;
