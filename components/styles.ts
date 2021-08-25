/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import styled from 'styled-components';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
	primary: '#ffffff',
	secondary: '#e5e7eb',
	tertiary: '#1f2937',
	darkLight: '#9ca3af',
	brand: '#6d28d9',
	green: '#8dbf4c',
	red: '#ef4444',
};

export const StyledContainer = styled(View)`
	flex: 1;
	padding: 25px;
	padding-top: ${StatusBarHeight + 30}px;
	background-color: ${Colors.primary};
`;

export const InnerContainer = styled(View)`
	flex: 1;
	width: 100%;
	align-items: center;
`;

export const PageLogo = styled(Image)`
	width: 250px;
	height: 250px;
`;

export const PageTitle = styled(Text)`
	font-size: 30px;
	text-align: center;
	font-weight: bold;
	color: ${Colors.green};
`;

export const SubTitle = styled(Text)`
	font-size: 18px;
	margin-bottom: 20px;
	font-weight: bold;
	color: ${Colors.tertiary};
`;

export const StyledFormArea = styled(View)`
	width: 90%;
`;

export const StyledTextInput = styled(TextInput)`
	background-color: ${Colors.secondary};
	padding: 15px 55px 15px 55px;
	border-radius: 5px;
	font-size: 16px;
	height: 60px;
	margin-vertical: 3px;
	margin-bottom: 10px;
	color: ${Colors.tertiary};
`;

export const StyledInputLabel = styled(Text)`
	color: ${Colors.tertiary};
	font-size: 13px;
	text-align: left;
`;

export const LeftIcon = styled(View)`
	left: 15px;
	top: 34px;
	position: absolute;
	z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
	right: 15px;
	top: 34px;
	position: absolute;
	z-index: 1;
`;

export const StyledButton: React.FC<{ [key: string]: any }> = styled(TouchableOpacity)`
	padding: 15px;
	background-color: ${(props) => props.disabled ? Colors.darkLight : Colors.green};
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	margin-vertical: 5px;
	height: 60px;

`;
export const ButtonText = styled(Text)`
	color: ${Colors.primary};
	font-size: 16px;
`;
//@ts-ignore

export const ErrorMsgBox = styled(Text)`
	text-align: center;
	font-size: 14px;
	padding: 10px 0;
	color: ${Colors.red}
`;

