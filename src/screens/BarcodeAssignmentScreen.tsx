/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useCallback, useEffect, useState } from 'react';
import {
	ButtonText,
	Colors,
	HorizontalLine,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledInputLabel,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
// @ts-ignore
import useAppContext from '../context/AppContext';
import InfiniteDropDown from '../components/InfiniteDropDown';
import ProductInfo, { IProductInfo } from '../components/ProductInfo';
import RouteNames from '../constants/route.names';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import { DeviceEventEmitter } from 'react-native';

// @ts-ignore
const BarcodeAssignmentScreen = ({ navigation }) => {
	const { t } = useAppContext();
	const [selectedProduct, setSelectedProduct] = useState<IProductInfo | undefined>();

	useEffect(() => {
		DeviceEventEmitter.addListener('setSelectedProduct', (eventData) => {
			setSelectedProduct(eventData);
		});
	}, []);

	const assignBarcodeToProduct = useCallback(
		async (scannedBarcode) => {
			if (selectedProduct) {
				try {
					await Communicator.updateProductEanCode(selectedProduct.productId, scannedBarcode);
					Toast.show({ title: t('BARCODE_ASSIGN_SUCCESSFULLY'), color: Colors.green, timing: 5000 });
				} catch (error) {
					Toast.show({ title: t('ERROR'), color: Colors.red, timing: 5000 });
				}
				setSelectedProduct(undefined);
			}
		},
		[selectedProduct],
	);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<StyledInputLabel>{t('CREATE_NEW_PRODUCT')}</StyledInputLabel>
					<StyledButton
						disabled={false}
						minWidth={'100%'}
						onPress={() => navigation.navigate(RouteNames.CREATE_PRODUCT)}
					>
						<ButtonText>{t('CREATE_PRODUCT')}</ButtonText>
					</StyledButton>
					<StyledInputLabel>{t('OR_SELECT_EXISTING_ONE')}</StyledInputLabel>
					<InfiniteDropDown setValue={setSelectedProduct} />
					<HorizontalLine />
					<ProductInfo product={selectedProduct} assignBarcodeToProduct={assignBarcodeToProduct} />
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default BarcodeAssignmentScreen;
