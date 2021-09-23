/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React from 'react';

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
import TextInput from '../components/TextInput';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
// @ts-ignore
import useCheckNvePrefix from '../hooks/useCheckNvePrefix';
import useWarehouseRacks from '../hooks/useWarehouseRacks';
import useLabeling from '../hooks/useLabeling';

// @ts-ignore
const Labeling = ({ navigation }) => {
	useWarehouseRacks();
	const { checkIsSignedIn } = useAppContext();
	const checkNveByPrefix = useCheckNvePrefix();
	const {
		nve, ean, sn, setNve, setEan, setSn, nveRef, eanRef, snRef, clearTextFields, createNewDocument, readyForLoadingAction,
	} = useLabeling(navigation);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{ nve, ean, sn }}
						onSubmit={(val) => createNewDocument(val)}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => <StyledFormArea>
							<TextInput
								label={'NVE'}
								placeholder={'NVE'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={(value: string) => {
									setNve(value);
									handleChange('nve')(value);
								}}
								reference={nveRef}
								onBlur={async (value: any) => {
									await checkNveByPrefix(nve, () => {
										eanRef.current && eanRef.current.focus();
										handleBlur('nve')(value);
									});
								}}
								value={values.nve}
								editable={true}
								icon={null}
							/>
							<TextInput
								label={'EAN'}
								placeholder={'EAN'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={(value: string) => {
									setEan(value);
									handleChange('ean')(value);
								}}
								reference={eanRef}
								onBlur={(value: any) => {
									// @ts-ignore
									snRef.current && snRef.current.focus();
									handleBlur('ean')(value);
								}}
								value={values.ean}
								editable={!!nve}
								disabled={!nve}
								icon={null}
							/>
							{!nve && <LabelingErrorMsgBox>Please fill NVE first</LabelingErrorMsgBox>}
							<TextInput
								label={'SN'}
								placeholder={'SN'}
								placeholderTextColor={Colors.darkLight}
								onChangeText={(value: string) => {
									setSn(value);
									handleChange('sn')(value);
								}}
								reference={snRef}
								onBlur={(value: any) => {
									handleBlur('sn')(value);
									handleSubmit();
									clearTextFields();
									// @ts-ignore
									nveRef.current && nveRef.current.focus();
								}}
								value={values.sn}
								editable={!!nve && !!ean}
								disabled={!nve || !ean}
								icon={null}
							/>
							{!ean && !nve && <LabelingErrorMsgBox>Please fill EAN and NVE first</LabelingErrorMsgBox>}
							{!ean && !!nve && <LabelingErrorMsgBox>Please fill EAN first</LabelingErrorMsgBox>}

							<StyledButton
								onPress={handleSubmit}
								disabled={!nve || !ean || !sn}
							>
								<ButtonText>{'Ok'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={readyForLoadingAction}>
								<ButtonText>{'Ready for loading'}</ButtonText>
							</StyledButton>
							<SecondaryStyledButton onPress={clearTextFields} disabled={false}>
								<SecondaryButtonText>{'Clear'}</SecondaryButtonText>
							</SecondaryStyledButton>
							<SecondaryStyledButton onPress={async () => {
								await Communicator.logout();
								checkIsSignedIn();
							}}>
								<SecondaryButtonText>Logout</SecondaryButtonText>
							</SecondaryStyledButton>
						</StyledFormArea>}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Labeling;