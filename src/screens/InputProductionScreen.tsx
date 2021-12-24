/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useState } from 'react';
import {
	ButtonText,
	Colors,
	InnerContainer,
	SecondaryButtonText,
	SecondaryStyledButton,
	StyledButton,
	StyledContainer,
	StyledInputLabel,
	StyledTextInput,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import DropDownPicker from 'react-native-dropdown-picker';
import useAppContext from '../context/AppContext';
import { View } from 'react-native';
import RouteNames from '../constants/route.names';
import useGeneralBins from '../hooks/useGeneralBins';

// @ts-ignore
const InputProductionScreen = ({ navigation }) => {
	const [eanOld, setEanOld] = useState<string>('');

	const {
		getBinByRackIdBinId,
		mappedGeneralBinsForDropdown,
		handleFilterGeneralBins,
	} = useGeneralBins(eanOld);

	const { t } = useAppContext();
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');

	const handleOk = useCallback(() => {
		const selectedBin = getBinByRackIdBinId(...value.split('-'));
		navigation.navigate(RouteNames.PRODUCTION, { selectedBin });
	}, [value]);

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer headerExist={true}>
				<InnerContainer>
					<StyledInputLabel>{t('PRODUCTION_AREA')}</StyledInputLabel>
					<DropDownPicker
						open={open}
						value={value}
						items={mappedGeneralBinsForDropdown}
						setOpen={setOpen}
						setValue={setValue}
						searchable={true}
						dropDownContainerStyle={{ borderColor: Colors.secondary }}
						searchContainerStyle={{
							borderColor: Colors.secondary,
							borderBottomColor: Colors.secondary,
							borderLeftColor: Colors.secondary,
						}}
						customItemContainerStyle={{ borderColor: Colors.secondary, zIndex: 1000000 }}
						searchTextInputStyle={{ borderColor: Colors.secondary, borderRadius: 4, height: 38 }}
						containerStyle={{ borderColor: Colors.secondary, zIndex: 1000000 }}
						style={{ borderColor: Colors.secondary, height: 38, zIndex: 1000000, borderRadius: 4 }}
						modalContentContainerStyle={{ borderRadius: 4, paddingLeft: 4, paddingRight: 4 }}
						closeIconStyle={{ width: 24, height: 24 }}
						listMode={'MODAL'}
					/>

					<StyledInputLabel style={{ paddingTop: 16 }}>{t('EAN_OLD')}</StyledInputLabel>
					<View style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}>
						<StyledTextInput
							minWidth={'60%'}
							placeholder={t('EAN_OLD')}
							value={eanOld}
							onChangeText={(value: string) => setEanOld(value)}
							blurOnSubmit={false}
							editable={true}
							icon={null}
						/>
						<SecondaryStyledButton onPress={() => handleFilterGeneralBins(eanOld)} disabled={false}
											   minWidth={'38%'} lastButton={true}>
							<SecondaryButtonText>{t('FILTER')}</SecondaryButtonText>
						</SecondaryStyledButton>
					</View>
					<StyledButton
						onPress={handleOk}
						disabled={false}
						minWidth={'100%'}
						lastButton={true}
					>
						<ButtonText>{t('OK')}</ButtonText>
					</StyledButton>

				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default InputProductionScreen;
