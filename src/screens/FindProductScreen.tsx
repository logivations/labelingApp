/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React from 'react';
import {
	ButtonGroup,
	ButtonText,
	Colors,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	StyledInputLabel,
} from '../components/styles';
import { StyleSheet, View } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
// @ts-ignore
import useAppContext from '../context/AppContext';
import RouteNames from '../constants/route.names';
// @ts-ignore
import BarcodeScanner from '../components/BarcodeScanner';
import TextInput from '../components/TextInput';
import { Formik } from 'formik';

// @ts-ignore
const FindProductScreen = ({ navigation }) => {
	const { t } = useAppContext();

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{ ean: '' }}
						onSubmit={(values) => {
							navigation.navigate(RouteNames.PRODUCT_STOCK_LIST, { ean: values.ean });
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values }) => {
							return (
								<StyledFormArea>
									<View style={styles.container}>
										<StyledInputLabel>{t('SEARCH_STOCK_BY_PRODUCT_EAN_CODE')}</StyledInputLabel>
										<BarcodeScanner
											handleBarCodeScanned={(barcode) => {
												handleChange('ean')(barcode.data);
											}}
										/>
									</View>
									<TextInput
										label={`${t('OR_WRITE_EAN_CODE_MANUALLY')}:`}
										icon={''}
										placeholder={'00000000000'}
										placeholderTextColor={Colors.darkLight}
										onChangeText={handleChange('ean')}
										onBlur={handleBlur('ean')}
										value={values.ean}
										keyboardType={'default'}
									/>
									<ButtonGroup>
										<StyledButton
											onPress={handleSubmit}
											disabled={!values.ean}
											minWidth={'100%'}
											lastButton={true}
										>
											<ButtonText>{t('SEARCH_STOCK')}</ButtonText>
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

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 160,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,
	},
});

export default FindProductScreen;
