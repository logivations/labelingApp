/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
// @ts-nocheck
import styled from 'styled-components';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';
import { PicklistScanStatus } from '../enums';

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
	primary: '#ffffff',
	secondary: '#d3d3d3',
	tertiary: '#1f2937',
	darkLight: '#9ca3af',
	green: '#8dbf4c',
	gray: '#4d4d4d',
	red: '#ef4444',
	statusColors: {
		success: '#8dbf4c',
		warning: '#e9d41e',
		error: '#e63e3e',
	},
};

export const StyledContainer: React.FC<{ headerExist: boolean }> = styled(View)`
	flex: 1;
	padding-top: ${(props) => (props.headerExist ? '16px' : `${StatusBarHeight}px`)};
	background-color: ${Colors.primary};
	position: relative;
	height: ${Dimensions.get('window').height}px;
	width: ${Dimensions.get('screen').width}px;
`;

export const InnerContainer = styled(View)`
	flex: 1;
	width: ${Dimensions.get('screen').width}px;
	height: 100%;
	align-items: flex-start;
	padding: 0 16px;
`;

export const PageTitle = styled(Text)`
	font-size: 32px;
	text-align: center;
	width: 100%;
	font-weight: 700;
	margin: 15px 0 0;
	color: ${Colors.green};
`;

export const SubTitle = styled(Text)`
	font-size: 16px;
	margin-bottom: 15px;
	margin-top: 15px;
	font-weight: bold;
	text-align: center;
	width: 100%;
	color: ${Colors.tertiary};
`;

export const StyledFormArea = styled(View)`
	width: 100%;
`;
export const StyledTextInput: React.FC<{
	minWidth?: string;
	isInvalid?: boolean;
	placeholder?: string;
	[key: string]: any;
}> = styled(TextInput)`
	background-color: ${(props) => (!!props.disabled ? Colors.secondary : Colors.primary)};
	border: 1px solid ${(props) => (props.isInvalid ? Colors.red : Colors.secondary)};
	padding: ${(props) => (props.authInput ? '0 0 0 40px' : '0 10px')};
	border-radius: 4px;
	font-size: 16px;
	height: 38px;
	margin-vertical: 0px;
	margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '10px')};
	color: ${Colors.tertiary};
	min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
`;

export const StyledInputLabel = styled(Text)`
	color: ${Colors.tertiary};
	font-size: 16px;
	text-align: left;
	font-weight: bold;
	margin-bottom: 5px;
`;

export const LeftIcon = styled(View)`
	left: 10px;
	top: 8px;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
	right: 0;
	top: 20px;
	padding: 10px;
	position: absolute;
	z-index: 1;
`;

export const StyledButton: React.FC<{ [key: string]: any }> = styled(TouchableOpacity)`
	padding: 0;
	background-color: ${Colors.green};
	opacity: ${(props) => (props.disabled ? '0.5' : '1')};
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '10px')};
	height: 38px;
	min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
`;

export const ButtonGroup = styled(View)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

export const SecondaryStyledButton = styled(StyledButton)`
	background-color: ${Colors.primary};
	border: 1px solid ${Colors.secondary};
`;

export const ButtonText = styled(Text)`
	color: ${({ color }: { color?: string }) => color || Colors.primary};
	font-size: ${({ fontSize, color }: { fontSize?: string; color?: string }) => fontSize || '16px'};
`;

export const SecondaryButtonText = styled(Text)`
	color: ${Colors.gray};
	font-size: 16px;
`;
//@ts-ignore

export const ErrorMsgBox = styled(Text)`
	text-align: left;
	font-size: 12px;
	margin-top: -5px;
	padding: 0 0 10px;
	color: ${({ color }: { color?: string }) => color || Colors.red};
`;

export const LabelingErrorMsgBox = styled(ErrorMsgBox)`
	padding: 0 0 10px 0;
	text-align: left;
`;

export const ListColumnWrapper = styled(View)`
	flex: ${({ flex }: { flex: number }) => flex};
	align-items: flex-start;
	justify-content: center;
	height: 100%;
`;

export const getColorByStatus = (status: PicklistScanStatus) => {
	switch (status) {
		case PicklistScanStatus.NOT_FOUND:
			return Colors.statusColors.error;
		case PicklistScanStatus.NOT_COMPLETE:
			return Colors.statusColors.warning;
		case PicklistScanStatus.READY_FOR_LOADING:
			return Colors.statusColors.success;
	}
};

export const ListItemWrapper = styled(View)`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
	margin: 5px 10px;
	border: 1.5px solid
		${({ scanStatus }: { scanStatus: PicklistScanStatus }) => {
			return getColorByStatus(scanStatus);
		}};
	border-left-width: 6px;
	border-radius: 4px;
	height: 38px;
`;

export const TooltipContainer = styled(View)`
	display: flex;
	flex-direction: row;
`;

export const TooltipText = styled(Text)`
	margin-left: 5px;
`;

export const LanguageContainer = styled(View)`
	width: 100%;
	margin: 15px 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

export const FlagButton: React.FC<{ [key: string]: any }> = styled(TouchableOpacity)`
	padding: 5px;
	margin: 0 5px;
	border: ${(props) => `1px solid ${props.isActive ? Colors.green : Colors.primary}`};
	border-radius: 6px;
`;

export const FlagWrapper = styled(View)`
	padding: 5px;
`;

export const HorizontalLine = styled(View)`
	border-bottom-color: #c4c4c4;
	border-bottom-width: 1px;
	width: 100%;
	padding-top: 16px;
	margin-bottom: 8px;
`;
