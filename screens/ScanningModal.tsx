/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { PermissionResponse } from 'expo-modules-core/src/PermissionsInterface';
import { BarCodeEvent } from 'expo-barcode-scanner/src/BarCodeScanner';

// @ts-ignore
const ScanningScreen = ({ navigation, route: { params: { onScan } } }) => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const requestPermissionsAsync = useCallback(() => {
		(async () => {
			const { granted }: PermissionResponse = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(granted);
		})();
	}, []);

	useEffect(() => {
		navigation.setOptions({ headerShown: true });
	}, [navigation]);
	useEffect(() => {
		requestPermissionsAsync();
	}, []);

	const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
		onScan(data);
		navigation.pop();
	};

	return (
		// <StyledContainer>
		// 	<InnerContainer>
		// 		{
		// 			hasPermission === null
		// 				? <Text>Requesting for camera permission</Text>
		// 				: !hasPermission
		// 				? <Text>No access to camera</Text>
		// 				: <BarCodeScanner
		// 					onBarCodeScanned={handleBarCodeScanned}
		// 					style={styles.scanner}
		// 				/>
		// 		}
		// 	</InnerContainer>
		// </StyledContainer>
		<BarCodeScanner
			onBarCodeScanned={handleBarCodeScanned}
			style={[StyleSheet.absoluteFill, styles.container]}
		>
			<View style={styles.layerTop}/>
			<View style={styles.layerCenter}>
				<View style={styles.layerLeft}/>
				<View style={styles.focused}/>
				<View style={styles.layerRight}/>
			</View>
			<View style={styles.layerBottom}/>
		</BarCodeScanner>
	);
};

// const styles = StyleSheet.create({
// 	scanner: {
// 		//...StyleSheet.absoluteFillObject,
// 		marginLeft: -60,
// 		marginTop: -60,
// 		width: Dimensions.get('screen').width + 120,
// 		// width: 1800,
// 		height: Dimensions.get('screen').height,
// 	}
// });


const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	layerTop: {
		flex: 2,
		backgroundColor: opacity,
	},
	layerCenter: {
		flex: 1,
		flexDirection: 'row',
	},
	layerLeft: {
		flex: 1,
		backgroundColor: opacity,
	},
	focused: {
		flex: 10,
	},
	layerRight: {
		flex: 1,
		backgroundColor: opacity,
	},
	layerBottom: {
		flex: 2,
		backgroundColor: opacity,
	},
});

export default ScanningScreen;
