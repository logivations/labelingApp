/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ButtonText, Colors, ErrorMsgBox, InnerContainer, StyledButton, StyledFormArea } from './styles';
import TextInput from './TextInput';
import { Formik } from 'formik';
import api from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import { CheckPlProps } from './Interfaces';

const CheckPLDialogWindow: React.FC<CheckPlProps> = ({ isOpen, setCheckPlDialogWindowOpen, latestPlId }) => {
	const [modalVisible, setModalVisible] = useState(isOpen);
	const [plId, setPlId] = useState<string>(latestPlId);
	useEffect(() => {
		setModalVisible(isOpen);
	}, [isOpen]);
	useEffect(() => {
		setPlId(latestPlId);
	}, [latestPlId]);

	const checkPlId = useCallback(async (info) => {
		try {
			const checkNve = await api.checkNveConsistent(info.plId);
			if (checkNve) {
				await api.setInternalOrdersReadyForPacking(info.plId);
				Toast.show({ title: 'READY_OF_LOADING' });
			} else {
				Toast.show({ title: 'NOT_COMPLETE' });
			}
		} finally {
			setCheckPlDialogWindowOpen(false);
		}
	}, []);
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
			>
				<InnerContainer style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Check PL-ID</Text>
						<Formik
							enableReinitialize={true}
							initialValues={{ plId }}
							onSubmit={(info) => checkPlId(info)}
						>
							{({ handleChange, handleBlur, handleSubmit, values }) => <StyledFormArea>
								<TextInput
									label={'PL-ID'}
									placeholder={'PL-ID'}
									placeholderTextColor={Colors.darkLight}
									onChangeText={(value: string) => {
										handleChange('plId')(value);
									}}
									onBlur={handleBlur('plId')}
									value={values.plId}
									editable={true}
									icon={null}
									minWidth={300}
								/>
								{!values.plId && <ErrorMsgBox>
									Set PL-ID for checking
								</ErrorMsgBox>}
								<StyledButton minWidth={310} onPress={handleSubmit} disabled={!values.plId}>
									<ButtonText>{'Check'}</ButtonText>
								</StyledButton>
							</StyledFormArea>
							}
						</Formik>

					</View>
				</InnerContainer>
			</Modal>
		</View>
	);
};


const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 5,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		minWidth: '90%',
	},
	openButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		fontSize: 16,
		textAlign: 'center',
	},
});

export default CheckPLDialogWindow;