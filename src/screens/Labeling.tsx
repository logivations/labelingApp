/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { SyntheticEvent } from 'react';

import {
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
import useAppContext from '../../AppContext';
import { Formik } from 'formik';
import Communicator from '../api/Communicator';
import StyledTextInput from '../components/TextInput';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import useWarehouseRacks from '../hooks/useWarehouseRacks';
import useLabeling from '../hooks/useLabeling';

// @ts-ignore
const Labeling = ({ navigation }) => {
	useWarehouseRacks();
	const { checkIsSignedIn, t } = useAppContext();
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
		createNewDocument,
		readyForLoadingAction,
		fillLabelingController,
	} = useLabeling(navigation);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{ nve, ean, sn }}
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
									onTextInput={({ nativeEvent: { text } }) => {
										fillLabelingController.onTextInput(text, clearTextFields);
									}}
									onBlur={(value: any) => {
										// @ts-ignore
										eanRef.current && eanRef.current.focus();
										handleBlur('nve')(value);
									}}
									reference={nveRef}
									value={values.nve}
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
									onTextInput={({ nativeEvent: { text } }) => {
										fillLabelingController.onTextInput(text, clearTextFields);
									}}
									onBlur={(value: any) => {
										// @ts-ignore
										snRef.current && snRef.current.focus();
										handleBlur('ean')(value);
									}}
									reference={eanRef}
									value={values.ean}
									editable={!!nve}
									disabled={!nve}
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
									onTextInput={({ nativeEvent: { text } }) => {
										fillLabelingController.onTextInput(text, clearTextFields);
									}}
									onBlur={async (value: SyntheticEvent) => {
										handleBlur('sn')(value);
										if (fillLabelingController.isManualInput) {
											await fillLabelingController.createDocument({
												nve,
												ean,
												sn,
											}, clearTextFields);
										} else {
											clearTextFields();
										}
										// @ts-ignore
										nveRef.current && nveRef.current.focus();
									}}
									reference={snRef}
									value={values.sn}
									editable={!!nve && !!ean}
									disabled={!nve || !ean}
									icon={null}
								/>
								{!ean && !nve && (
									<LabelingErrorMsgBox>{t('PLEASE_FILL_EAN_AND_NVE_FIRST')}</LabelingErrorMsgBox>
								)}
								{!ean && !!nve &&
								<LabelingErrorMsgBox>{t('PLEASE_FILL_EAN_FIRST')}</LabelingErrorMsgBox>}

								<StyledButton onPress={handleSubmit} disabled={!nve || !ean || !sn}>
									<ButtonText>{t('OK')}</ButtonText>
								</StyledButton>
								<StyledButton onPress={readyForLoadingAction}>
									<ButtonText>{t('READY_FOR_LOADING')}</ButtonText>
								</StyledButton>
								<SecondaryStyledButton onPress={clearTextFields} disabled={false}>
									<SecondaryButtonText>{t('CLEAR')}</SecondaryButtonText>
								</SecondaryStyledButton>
								<SecondaryStyledButton
									onPress={async () => {
										await Communicator.logout();
										checkIsSignedIn();
									}}
								>
									<SecondaryButtonText>{t('LOGOUT')}</SecondaryButtonText>
								</SecondaryStyledButton>
							</StyledFormArea>
						)}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Labeling;
