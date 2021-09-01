/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { InnerContainer, StyledContainer } from './styles';
import { PermissionResponse } from 'expo-modules-core/src/PermissionsInterface';
import { BarCodeEvent } from 'expo-barcode-scanner/src/BarCodeScanner';
import { ScanningModalProps } from './Interfaces';

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

	return (
		<StyledContainer>
			<InnerContainer>
				{
					hasPermission === null
						? <Text>Requesting for camera permission</Text>
						: !hasPermission
						? <Text>No access to camera</Text>
						: <BarCodeScanner
							onBarCodeScanned={handleBarCodeScanned}
							style={StyleSheet.absoluteFillObject}
						/>
				}
			</InnerContainer>
		</StyledContainer>
	);
};

export default ScanningModal;
