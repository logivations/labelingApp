/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React from 'react';
import { TextInputProps } from './Interfaces';
import { View } from 'react-native';
import { Colors, LeftIcon, StyledInputLabel, StyledTextInput } from './styles';
import { Octicons } from '@expo/vector-icons';

const TextInput: React.FC<TextInputProps> = ({ label, reference, icon, rightIcon, ...props }) => {
	return (
		<View>
			<LeftIcon>
				<Octicons name={icon} size={24} color={Colors.green}/>
			</LeftIcon>
			<StyledInputLabel>{label}</StyledInputLabel>
			<StyledTextInput {...props} ref={reference}/>
			{rightIcon && rightIcon}
		</View>
	);
};

export default TextInput;
