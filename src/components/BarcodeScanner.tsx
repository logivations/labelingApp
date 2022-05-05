/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import useAppContext from '../context/AppContext';

interface IBarcodeProps {
	scanned?: boolean;
	handleBarCodeScanned: BarCodeScannedCallback;
}

const BarcodeScanner: React.FC<IBarcodeProps> = ({ scanned, handleBarCodeScanned }) => {
	const { t } = useAppContext();
	const [isScanned, setScanned] = useState(scanned);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		setScanned(scanned);
	}, [scanned]);

	useEffect(() => {
		(async () => await requestPermission())();
	}, []);

	const requestPermission = useCallback(async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		const isGranted = status === 'granted';
		setHasPermission(isGranted);
	}, []);

	const handleScanning = useCallback((scannedInfo) => {
		setScanned(true);
		handleBarCodeScanned(scannedInfo);
	}, []);
	if (hasPermission === null) {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={requestPermission}>
					<Text>Requesting for camera permission</Text>
				</TouchableOpacity>
			</View>
		);
	} else if (!hasPermission) {
		return (
			<View style={styles.container}>
				<Text>No access to camera</Text>
			</View>
		);
	} else {
		return (
			<View style={styles.scannerContainer}>
				<BarCodeScanner
					onBarCodeScanned={isScanned ? undefined : handleScanning}
					style={styles.scannerCamera}
				/>

				{isScanned && (
					<View style={styles.button}>
						<Button color={'#8dbf4c'} title={t('TAP_TO_SCAN_AGAIN')} onPress={() => setScanned(false)} />
					</View>
				)}
			</View>
		);
	}
};

BarcodeScanner.defaultProps = {
	scanned: false,
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		paddingTop: 20,
		width: '100%',
		height: 150,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	scannerCamera: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
		height: 150,
	},
	button: {
		marginTop: 20,
		zIndex: 100000,
	},
	scannerContainer: {
		position: 'relative',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: 150,
		width: '100%',
		marginBottom: 8,
	},
});

export default BarcodeScanner;
