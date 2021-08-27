/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useState } from 'react';

import {
	ButtonText,
	Colors,
	InnerContainer,
	LabelingErrorMsgBox,
	StyledButton,
	StyledContainer,
	StyledFormArea,
} from '../components/styles';
import useAppContext from '../AppContext';
import { Formik } from 'formik';

import TextInput from '../components/TextInput';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Popup, Toast } from 'popup-ui';
import CheckPLDialogWindow from '../components/CheckPLDialogWindow';

const Labeling = () => {

	const { checkIsSignedIn } = useAppContext();
	const [nve, setNve] = useState<string>('');
	const [ean, setEan] = useState<string>('');
	const [sn, setSn] = useState<string>('');

	const [isCheckPlDialogWindowOpen, setCheckPlDialogWindowOpen] = useState<boolean>(false);

	const clearTextFields = () => {
		setNve('');
		setEan('');
		setSn('');
	};

	// console.log(`
	// 	NVE -> >${nve}<;
	// 	EAN -> >${ean}<;
	// 	SN -> >${sn}<;
	// `);
	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
				<InnerContainer>
					<Formik
						initialValues={{ nve: '', ean: '', sn: '' }}
						onSubmit={(val) => {
						}}
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
								onBlur={handleBlur('nve')}
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
								onBlur={handleBlur('ean')}
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
								onBlur={handleBlur('sn')}
								value={values.sn}
								editable={!!nve && !!ean}
								disabled={!nve || !ean}
								icon={null}
							/>
							{!ean && !nve && <LabelingErrorMsgBox>Please fill EAN and NVE first</LabelingErrorMsgBox>}
							{!ean && !!nve && <LabelingErrorMsgBox>Please fill EAN first</LabelingErrorMsgBox>}

							<StyledButton onPress={() => {
								setCheckPlDialogWindowOpen(!isCheckPlDialogWindowOpen);
								// }} disabled={!nve || !ean || !sn}>
							}}>

								<ButtonText>{'Ok'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={() => {
								Toast.show({
									title: 'User created',
									text: 'Your user was successfully created, use the app now.',
									color: '#8dbf4c',
								});
							}}>
								<ButtonText>{'Ready for loading'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={async () => {
								Popup.show({
									type: 'Success',
									title: 'Upload complete',
									button: true,
									textBody: 'Congrats! Your upload successfully done',
									buttonText: 'Ok',
									callback: () => Popup.hide(),
								});
							}} disabled={false}>
								<ButtonText>{'Clear'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={async () => {
								await Communicator.logout();
								checkIsSignedIn();
							}}>
								<ButtonText>Logout</ButtonText>
							</StyledButton>
						</StyledFormArea>}
					</Formik>
					<CheckPLDialogWindow isOpen={isCheckPlDialogWindowOpen}/>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Labeling;