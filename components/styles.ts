/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
// @ts-nocheck
import styled from 'styled-components';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';

const StatusBarHeight = Constants.statusBarHeight;
console.log('Dimensions.get(', Dimensions.get('screen').height);
console.log('Dimensions.get(', Dimensions.get('window'));
//colors
export const Colors = {
	primary: '#ffffff',
	secondary: '#d3d3d3',
	tertiary: '#1f2937',
	darkLight: '#9ca3af',
	brand: '#6d28d9',
	green: '#8dbf4c',
	red: '#ef4444',
};

export const StyledContainer = styled(View)`
	flex: 1;
	padding-top: ${StatusBarHeight}px;
	background-color: ${Colors.primary};
	position: relative;
	height: ${Dimensions.get('screen').height}px;
	width: ${Dimensions.get('screen').width}px;
`;

export const InnerContainer = styled(View)`
	flex: 1;
	width: ${Dimensions.get('screen').width}px;
	height: ${Dimensions.get('screen').height}px;
	align-items: center;
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
	background-color: ${(props) => !!props.disabled ? Colors.secondary : Colors.primary};
	border: 1px solid ${Colors.secondary}
	padding: 15px 55px 15px 55px;
	border-radius: 5px;
	font-size: 16px;
	height: 60px;
	margin-vertical: 3px;
	margin-bottom: 10px;
	color: ${Colors.tertiary};
	min-width: ${(props) => props.minWidth ? props.minWidth + 'px' : 'auto'};
`;

export const StyledInputLabel = styled(Text)`
	color: ${Colors.tertiary};
	font-size: 16px;
	text-align: left;
`;

export const LeftIcon = styled(View)`
	left: 15px;
	top: 34px;
	position: absolute;
	z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
	right: 0;
	top: 21px;
	padding: 15px;
	position: absolute;
	z-index: 1;
`;

export const StyledButton: React.FC<{ [key: string]: any }> = styled(TouchableOpacity)`
	padding: 15px;
	background-color: ${Colors.green};
	opacity: ${(props) => props.disabled ? '0.5' : '1'};
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	margin-vertical: 5px;
	height: 60px;
	min-width: ${(props) => props.minWidth ? props.minWidth + 'px' : 'auto'};
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

export const LabelingErrorMsgBox = styled(ErrorMsgBox)`
	padding: 0 0 10px 0;
	text-align: left;
`;

