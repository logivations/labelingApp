/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { ButtonText, Colors, ErrorMsgBox, InnerContainer, StyledButton, StyledFormArea } from './styles';
import TextInput from './TextInput';
import { Formik } from 'formik';

// @ts-ignore
const CheckPLDialogWindow = ({ isOpen }) => {
	const [modalVisible, setModalVisible] = useState(isOpen);
	useEffect(() => {
		setModalVisible(isOpen);
	}, [isOpen]);
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
				}}>
				<InnerContainer style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Check PL-ID</Text>
						<Formik
							initialValues={{ plId: '' }}
							onSubmit={(val) => {
							}}
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
									minWidth={200}
								/>
								{!values.plId && <ErrorMsgBox>
									Set first connection properties in Settings
								</ErrorMsgBox>}
								<StyledButton minWidth={210} onPress={handleSubmit}>
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
		// width: 300,
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