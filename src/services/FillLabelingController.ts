/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

class FillLabelingController {
	private readonly setNve: Function;
	private readonly setEan: Function;
	private readonly setSn: Function;
	private readonly createNewDocument: Function;
	private readonly refs: { [key: string]: any };
	private fields: { [key: string]: string };

	private documentWasCreated: boolean = false;
	public isManualInput: boolean = false;

	constructor(
		setNve: Function,
		setEan: Function,
		setSn: Function,
		createNewDocument: Function,
		refs: { [key: string]: any },
	) {
		this.setNve = setNve;
		this.setEan = setEan;
		this.setSn = setSn;
		this.refs = {
			nve: refs.nveRef,
			ean: refs.eanRef,
			sn: refs.snRef,
		};

		this.createNewDocument = createNewDocument;

		this.fields = {
			nve: '',
			ean: '',
			sn: '',
		};
	}

	public async onTextInput(text: string, clearTextInput: Function): Promise<void> {
		if (text.length && text.length !== 1) {
			this.isManualInput = false;
			await this.handleChange(text, clearTextInput);
		} else {
			this.isManualInput = true;
		}
	}

	public async onSubmitEditing(
		fieldName: string,
		nextFieldName: string,
		event: NativeSyntheticEvent<TextInputFocusEventData>,
		handleBlur: Function,
		onBlur?: Function,
	): Promise<void> {
		event.persist();

		onBlur && (await onBlur());
		const nextFieldRef = this.refs[nextFieldName];

		nextFieldRef.current && nextFieldRef.current.focus();
		handleBlur(fieldName)(event);
	}

	private async handleChange(value: string, clearTextFields: Function): Promise<void> {
		if (!this.fields.nve) {
			this.fields.nve = value;
			this.setNve(value);
		} else if (!this.fields.ean) {
			this.fields.ean = value;
			this.setEan(value);
		} else if (!this.fields.sn) {
			this.fields.sn = value;
			this.setSn(value);
		}

		await this.createDocument(this.fields, clearTextFields);
	}

	public createDocument(
		fields: { [x: string]: string; nve?: any; ean?: any; sn?: any },
		clearTextFields: Function,
	): Promise<any> {
		return new Promise((resolve, reject) => {
			if (fields.nve && fields.ean && fields.sn && !this.documentWasCreated) {
				this.documentWasCreated = true;
				setTimeout(async () => {
					try {
						await this.createNewDocument(fields);
						resolve();
					} catch (error) {
						reject(error);
					} finally {
						clearTextFields && clearTextFields();
					}
				}, 500);
			} else {
				resolve();
			}
		});
	}

	public clearFields(): void {
		this.fields = {
			nve: '',
			ean: '',
			sn: '',
		};
		this.documentWasCreated = false;
	}
}

export default FillLabelingController;
