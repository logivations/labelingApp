/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { TextInputProps } from './Interfaces';
import { View } from 'react-native';
import { Colors, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput } from './styles';
import { Ionicons, Octicons } from '@expo/vector-icons';

const TextInput: React.FC<TextInputProps> = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
	return <View>
		<LeftIcon>
			<Octicons name={icon} size={30} color={Colors.green}/>
		</LeftIcon>
		<StyledInputLabel>{label}</StyledInputLabel>
		<StyledTextInput {...props}/>
		{isPassword && (
			<RightIcon onPress={() => setHidePassword && setHidePassword(!hidePassword)}>
				<Ionicons
					size={30}
					color={Colors.darkLight}
					name={hidePassword ? 'md-eye-off' : 'md-eye'}
				/>
			</RightIcon>
		)}
	</View>;
};

export default TextInput;