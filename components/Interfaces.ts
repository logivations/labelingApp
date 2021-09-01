/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

export interface TextInputProps {
	label: string,
	icon: any,
	isPassword?: boolean,
	hidePassword?: boolean,
	setHidePassword?: Function,

	[key: string]: any
}

export interface CheckPlProps {
	isOpen: boolean,
	setCheckPlDialogWindowOpen: Function,
	latestPlId: string
}

export interface ScanningModalProps {
	isOpen: boolean,
	setScanningWindowOpen: Function,
	getOnBarcodeScan: Function,
	scanningWindowType: string,
}