/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useMemo, useState } from 'react';
import {
	ButtonGroup,
	ButtonText,
	Colors,
	InnerContainer,
	StyledButton,
	StyledContainer,
	StyledFormArea,
	StyledInputLabel,
	StyledTextInput,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import useAppContext from '../context/AppContext';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import DropDownPicker from 'react-native-dropdown-picker';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import { JAVA_INT_MAX_VALUE } from '../constants/constants';
import { Octicons } from '@expo/vector-icons';

// @ts-ignore
const CreateStockRecordScreen = ({ navigation, route }) => {
	const { t, mappedRacksById } = useAppContext();
	const [open, setOpen] = useState<boolean>(false);
	const productId = useMemo(() => route.params.productId, [route.params]);

	// const [multiplier, setMultiplier] = useState(1);
	// const [isQuantityValid, setQuantityValid] = useState('');
	//

	const dropDownData = useMemo(() => {
		return [...mappedRacksById.values()].reduce((acc, rack) => {
			const bins = [...rack.bins.values()].map((bin) => ({
				label: bin.text,
				value: `${bin.rackId}-${bin.binId}`,
			}));
			return [...acc, ...bins];
		}, []);
	}, [mappedRacksById]);

	const defaultRackBin = useMemo(() => {
		const defaultRack = [...mappedRacksById.values()].reduce((rackWithLowestPickPriority, rack) => {
			return rackWithLowestPickPriority.pickPriority < rack.pickPriority ? rackWithLowestPickPriority : rack;
		});
		return [...defaultRack.bins.values()].reduce((binWithLowestSequence, bin) => {
			return binWithLowestSequence.sequence < bin.sequence ? binWithLowestSequence : bin;
		});
	}, [mappedRacksById]);

	// const newQuantityValue = useMemo(() => +quantityValue * multiplier, [multiplier, quantityValue]);
	// const checkValidation = useCallback((quantity: number) => {
	// 	const isValid = (() => {
	// 		if (multiplier === 1) return Math.abs(+quantityValue + quantity) > JAVA_INT_MAX_VALUE;
	// 		if (multiplier === -1) return +quantityValue > quantity;
	// 	})();
	// 	setQuantityValid(isValid);
	// }, [multiplier]);
	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<Formik
						enableReinitialize={true}
						initialValues={{
							quantity: '',
							rackId: defaultRackBin.rackId,
							binId: defaultRackBin.binId,
							quantityMultiplier: '1',
						}}
						validateOnChange={true}
						validate={(values) => {
							if (Math.abs(parseInt(values.quantity, 10)) > JAVA_INT_MAX_VALUE) {
								return { quantity: true };
							}
						}}
						onSubmit={async (values) => {
							try {
								await Communicator.createNewStockLevelRecord(
									parseInt(productId, 10),
									parseInt(values.rackId, 10),
									parseInt(values.binId, 10),
									parseInt(values.quantity, 10) * parseInt(values.quantityMultiplier, 10),
								);
								DeviceEventEmitter.emit('refreshStock');
								Toast.show({
									title: t('STOCK_RECORD_CREATED_SUCCESSFULLY'),
									color: Colors.green,
									timing: 5000,
								});
								navigation.goBack();
							} catch (error) {
								Toast.show({ title: error.message, color: Colors.red, timing: 5000 });
							}
						}}
					>
						{({ errors, handleChange, handleBlur, handleSubmit, values }) => {
							const minusButtonActive = values.quantityMultiplier === '-1';
							// @ts-ignore
							return (
								<StyledFormArea>
									<View style={{ width: '100%' }}>
										<StyledInputLabel>{t('SELECT_BIN')}</StyledInputLabel>
										<DropDownPicker
											open={open}
											value={`${values.rackId}-${values.binId}`}
											items={dropDownData || []}
											setOpen={setOpen}
											setValue={(value) => {
												const [rackId, binId] = value().split('-');
												handleChange('rackId')(rackId);
												handleChange('binId')(binId);
											}}
											searchable={true}
											// @ts-ignore
											flatListProps={{
												keyExtractor: (item: any) => item.value,
											}}
											dropDownContainerStyle={{ borderColor: Colors.secondary }}
											searchContainerStyle={{
												borderColor: Colors.secondary,
												borderBottomColor: Colors.secondary,
												borderLeftColor: Colors.secondary,
											}}
											customItemContainerStyle={{
												borderColor: Colors.secondary,
												zIndex: 1000000,
											}}
											searchTextInputStyle={{
												borderColor: Colors.secondary,
												borderRadius: 4,
												height: 38,
											}}
											containerStyle={{ borderColor: Colors.secondary, zIndex: 1000000 }}
											style={{
												borderColor: Colors.secondary,
												height: 38,
												zIndex: 1000000,
												borderRadius: 4,
											}}
											modalContentContainerStyle={{
												borderRadius: 4,
												paddingLeft: 4,
												paddingRight: 4,
											}}
											closeIconStyle={{ width: 24, height: 24 }}
											listMode={'MODAL'}
										/>
									</View>
									<View style={styles.wrapper}>
										<View style={styles.buttonWrapper}>
											<TouchableOpacity
												onPress={() => handleChange('quantityMultiplier')('1')}
												style={
													!minusButtonActive
														? styles.multiplierButtonActive
														: styles.multiplierButton
												}
											>
												<Octicons
													name={'plus'}
													size={20}
													color={!minusButtonActive ? Colors.primary : Colors.green}
												/>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => handleChange('quantityMultiplier')('-1')}
												style={
													minusButtonActive
														? styles.multiplierButtonActive
														: styles.multiplierButton
												}
											>
												<Octicons
													name={'dash'}
													size={20}
													color={minusButtonActive ? Colors.primary : Colors.green}
												/>
											</TouchableOpacity>
										</View>
										<StyledTextInput
											label={''}
											icon={''}
											placeholder={t('QUANTITY')}
											placeholderTextColor={Colors.darkLight}
											onChangeText={handleChange('quantity')}
											onBlur={handleBlur('quantity')}
											isInvalid={!!errors.quantity}
											value={values.quantity}
											keyboardType={'numeric'}
											width={'70%'}
											marginBottom={'0px'}
											blurOnSubmit={false}
											editable={true}
										/>
									</View>
									<ButtonGroup>
										<StyledButton
											onPress={handleSubmit}
											disabled={
												!values.quantity || !values.rackId || !values.binId || errors.quantity
											}
											minWidth={'100%'}
											lastButton={true}
										>
											<ButtonText>{t('CREATE_STOCK_RECORD')}</ButtonText>
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
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: 38,
		marginTop: 10,
		marginBottom: 10,
	},
	buttonWrapper: {
		width: '25%',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
});

export default CreateStockRecordScreen;
