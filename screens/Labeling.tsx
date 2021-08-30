/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useCallback, useState } from 'react';

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
import api from './../api/Communicator';
import TextInput from '../components/TextInput';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import CheckPLDialogWindow from '../components/CheckPLDialogWindow';

const Labeling = () => {
	const { checkIsSignedIn } = useAppContext();
	const [nve, setNve] = useState<string>('');
	const [ean, setEan] = useState<string>('');
	const [sn, setSn] = useState<string>('');

	const [isCheckPlDialogWindowOpen, setCheckPlDialogWindowOpen] = useState<boolean>(false);
	const [latestPlId, setLatestPlId] = useState<string>('');

	const clearTextFields = useCallback(() => {
		setNve('');
		setEan('');
		setSn('');
	}, [setNve, setEan, setSn]);

	const createNewDocument = useCallback(async (info) => {
		await api.createNewDocument(info);
		Toast.show({ title: 'NVE_IS_ADDED' });
	}, []);
	const readyForLoadingAction = useCallback(async () => {
		try {
			const plId = await api.getLatestPlId();
			plId && setLatestPlId(plId);
		} finally {
			setCheckPlDialogWindowOpen(true);
		}
	}, []);

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

							<StyledButton
								onPress={handleSubmit}
								disabled={!nve || !ean || !sn}
							>
								<ButtonText>{'Ok'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={readyForLoadingAction}>
								<ButtonText>{'Ready for loading'}</ButtonText>
							</StyledButton>
							<StyledButton onPress={clearTextFields} disabled={false}>
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
					<CheckPLDialogWindow
						isOpen={isCheckPlDialogWindowOpen}
						setCheckPlDialogWindowOpen={setCheckPlDialogWindowOpen}
						latestPlId={latestPlId}
					/>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default Labeling;