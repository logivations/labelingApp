/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { InnerContainer } from './styles';
import { PermissionResponse } from 'expo-modules-core/src/PermissionsInterface';
import { BarCodeEvent } from 'expo-barcode-scanner/src/BarCodeScanner';
import { ScanningModalProps } from './Interfaces';

const { width, height } = Dimensions.get('window');


const ScanningModal: React.FC<ScanningModalProps> = ({ isOpen, scanningWindowType, setScanningWindowOpen, getOnBarcodeScan }) => {
	const [modalVisible, setModalVisible] = useState<boolean>(isOpen);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [scanned, setScanned] = useState<boolean>(false);

	const onBarcodeScan = useMemo(() => {
		return getOnBarcodeScan(scanningWindowType);
	}, [scanningWindowType, getOnBarcodeScan]);

	const requestPermissionsAsync = useCallback(() => {
		(async () => {
			const { granted }: PermissionResponse = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(granted);
		})();
	}, []);

	useEffect(() => {
		setModalVisible(isOpen);
	}, [isOpen]);
	useEffect(() => {
		requestPermissionsAsync();
	}, []);

	const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
		onBarcodeScan(data);
		setScanningWindowOpen(null);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	} else if (!hasPermission) {
		return <Text>No access to camera</Text>;
	} else {
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={modalVisible}
				>
					<InnerContainer style={styles.centeredView}>
						<View style={styles.modalView}>
							<TouchableWithoutFeedback style={styles.overlay} onPress={() => {
								console.log('qwe');
							}}>
								<BarCodeScanner
									onBarCodeScanned={handleBarCodeScanned}
									style={StyleSheet.absoluteFillObject}
								/>
							</TouchableWithoutFeedback>
							{/*<Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />*/}
						</View>
					</InnerContainer>
				</Modal>
			</View>
		);
	}
};

console.log('width, height', width, height);

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		opacity: 0.5,
		backgroundColor: 'black',
		width: width,
		height: height,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 10,
		backgroundColor: 'transparent',
		padding: 20,
		alignItems: 'center',
		elevation: 5,
		minWidth: '70%',
		minHeight: '70%',
	},

});

export default ScanningModal;
