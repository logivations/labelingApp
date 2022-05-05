/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonText, StyledButton, StyledInputLabel } from './styles';
import useAppContext from '../context/AppContext';
import BarcodeScanner from './BarcodeScanner';

export interface IProductInfo {
	name: string;
	productId: number;
}

interface IScannedInfo {
	type: string;
	data: string;

	[key: string]: any;
}

const ProductInfo: React.FC<{ product: IProductInfo | undefined; assignBarcodeToProduct: Function }> = ({
	product,
	assignBarcodeToProduct,
}) => {
	const { t } = useAppContext();
	const [scanned, setScanned] = useState(false);
	const [scannedBarcode, setScannedBarcode] = useState<string>('');

	const handleBarCodeScanned = useCallback((scannedInfo: IScannedInfo) => {
		setScanned(true);
		setScannedBarcode(scannedInfo.data);
	}, []);

	useEffect(() => {
		setScanned(false);
		setScannedBarcode('');
	}, [product]);

	if (!product) {
		return null;
	} else {
		return (
			<View style={styles.container}>
				<StyledInputLabel>{t('SCAN_BARCODE_FOR_PRODUCT')}:</StyledInputLabel>
				<Text style={styles.text}>{product.name}</Text>
				<BarcodeScanner scanned={scanned} handleBarCodeScanned={handleBarCodeScanned} />
				{scannedBarcode ? (
					<Fragment>
						<StyledInputLabel>{t('SCANNED_BARCODE')}:</StyledInputLabel>
						<Text style={styles.text}>{scannedBarcode}</Text>
						<StyledButton
							disabled={false}
							minWidth={'100%'}
							onPress={() => assignBarcodeToProduct(scannedBarcode)}
						>
							<ButtonText>{t('ASSIGN_BARCODE_TO_PRODUCT')}</ButtonText>
						</StyledButton>
					</Fragment>
				) : null}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		width: '100%',
		height: 400,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	scannerContainer: {
		flex: 1,
		height: 100,
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 8,
	},
	text: {
		marginBottom: 8,
	},
});

export default ProductInfo;
