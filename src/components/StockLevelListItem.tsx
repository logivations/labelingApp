/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useMemo, useState } from 'react';
import useAppContext from '../context/AppContext';
import { DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IStock } from '../screens/ProductStockListScreen';
import { ButtonText, Colors, StyledButton, StyledTextInput } from './styles';
import { Octicons } from '@expo/vector-icons';
import Communicator from '../api/Communicator';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';
import { JAVA_INT_MAX_VALUE } from '../constants/constants';

const StockLevelListItem: React.FC<any> = ({ getRackAndBinName, item }) => {
	const { t } = useAppContext();
	const { rackId, binId, productId, quantity } = item;
	const { rackName, binName } = getRackAndBinName(rackId, binId);

	const [multiplier, setMultiplier] = useState(1);
	const [quantityValue, setQuantityValue] = useState('');
	const minusButtonActive = useMemo(() => multiplier === -1, [multiplier]);
	const newQuantityValue = useMemo(() => +quantityValue * multiplier, [multiplier, quantityValue]);
	const isInvalid = useMemo(() => {
		if (multiplier === 1) {
			return Math.abs(+quantityValue + quantity) > JAVA_INT_MAX_VALUE;
		}
		if (multiplier === -1) {
			return +quantityValue > quantity;
		}
	}, [quantityValue, multiplier, quantity]);

	// @ts-ignore
	return (
		<>
			<View style={styles.item}>
				<View style={styles.itemRight}>
					<Text style={styles.itemText}>
						<Text style={styles.textBold}>Rack:</Text> {rackName}
					</Text>
					<Text style={styles.itemText}>
						<Text style={styles.textBold}>Bin:</Text> {binName}
					</Text>
				</View>
				<View style={styles.itemLeft}>
					<Text style={styles.itemText}>
						<Text style={styles.textBold}>Quantity:</Text> {quantity}
					</Text>
				</View>
				<View style={styles.wrapper}>
					<View style={styles.buttonWrapper}>
						<TouchableOpacity
							onPress={() => setMultiplier(1)}
							style={!minusButtonActive ? styles.multiplierButtonActive : styles.multiplierButton}
						>
							<Octicons
								name={'plus'}
								size={20}
								color={!minusButtonActive ? Colors.primary : Colors.green}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setMultiplier(-1)}
							style={minusButtonActive ? styles.multiplierButtonActive : styles.multiplierButton}
						>
							<Octicons
								name={'dash'}
								size={20}
								color={minusButtonActive ? Colors.primary : Colors.green}
							/>
						</TouchableOpacity>
					</View>

					<StyledTextInput
						keyboardType={'numeric'}
						width={'40%'}
						marginBottom={'0px'}
						label={t('QUANTITY')}
						placeholder={t('QUANTITY')}
						placeholderTextColor={Colors.darkLight}
						blurOnSubmit={false}
						editable={true}
						icon={null}
						isInvalid={isInvalid}
						value={quantityValue}
						onChangeText={(value: string) => {
							setQuantityValue(value);
						}}
					/>

					<StyledButton
						minWidth={'25%'}
						marginBottom={'0px'}
						disabled={isInvalid}
						onPress={async () => {
							await Communicator.createNewStockLevelRecord(
								parseInt(productId, 10),
								parseInt(rackId, 10),
								parseInt(binId, 10),
								newQuantityValue,
							);
							DeviceEventEmitter.emit('refreshStock');
							setQuantityValue('');
						}}
					>
						<ButtonText fontSize={'16px'}>{t('SAVE')}</ButtonText>
					</StyledButton>
				</View>
			</View>
		</>
	);
};

const StockLevelList: React.FC<{ stockList: IStock[] }> = ({ stockList }) => {
	const { mappedRacksById } = useAppContext();

	const getRackAndBinName = useCallback(
		(rackId, binId) => {
			const rack = mappedRacksById.get(rackId);
			if (rack) {
				const bin = rack.bins.get(binId);
				if (bin) {
					return { rackName: rack.text, binName: bin.text };
				}
			}
			return { rackName: '\u2014', binName: '\u2014' };
		},
		[mappedRacksById],
	);

	return (
		<KeyboardAvoidingWrapper>
			<View style={styles.container}>
				<FlatList
					style={styles.safeAreaStyle}
					data={stockList}
					renderItem={(props) => <StockLevelListItem getRackAndBinName={getRackAndBinName} {...props} />}
					keyExtractor={(item) => `${item.rackId}-${item.binId}`}
				/>
			</View>
		</KeyboardAvoidingWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 0,
	},
	safeAreaStyle: {},
	itemRight: {
		paddingTop: 10,
		paddingBottom: 10,
		width: '55%',
	},
	itemLeft: {
		padding: 10,
		width: '45%',
	},
	itemText: {
		paddingTop: 4,
		paddingBottom: 4,
	},
	multiplierButton: {
		width: 38,
		height: 38,
		borderColor: '#8dbf4c',
		borderWidth: 1,
		color: Colors.green,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		backgroundColor: Colors.primary,
	},
	multiplierButtonActive: {
		width: 38,
		height: 38,
		borderColor: '#8dbf4c',
		backgroundColor: Colors.green,
		borderWidth: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
	},
	textBold: {
		fontWeight: '600',
	},
	item: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		borderColor: Colors.green,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		marginVertical: 8,
	},
	title: {
		fontSize: 32,
	},
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: 38,
	},
	buttonWrapper: {
		width: '25%',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
});

export default StockLevelList;
