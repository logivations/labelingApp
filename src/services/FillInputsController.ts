/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

class FillInputsController {
	private readonly setters: { [key: string]: Function };
	private readonly createNewDocument: Function = () => {
	};
	private readonly refs: { [key: string]: any };
	private fields: { [key: string]: string };

	private documentWasCreated: boolean = false;
	private fieldNames: string[] = [];
	public isManualInput: boolean = false;

	constructor(createNewDocument: Function, refs: any[], setters: { [key: string]: Function }, fieldNames: string[]) {
		this.setters = setters;
		this.refs = fieldNames.reduce((acc, fieldName, index) => ({ ...acc, [fieldName]: refs[index] }), {});
		this.fields = fieldNames.reduce((acc, fieldName, index) => ({ ...acc, [fieldName]: '' }), {});

		this.createNewDocument = createNewDocument;
		this.fieldNames = fieldNames;
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

	private handleChange(value: string, clearTextFields: Function): void {
		if (!this.fields[this.fieldNames[0]]) {
			this.fields[this.fieldNames[0]] = value;
			this.setters[this.fieldNames[0]](value);
		} else if (!this.fields[this.fieldNames[1]]) {
			this.fields[this.fieldNames[1]] = value;
			this.setters[this.fieldNames[1]](value);
		} else if (!this.fields[this.fieldNames[2]]) {
			this.fields[this.fieldNames[2]] = value;
			this.setters[this.fieldNames[2]](value);
		}

		this.createDocument(this.fields, clearTextFields);
	}

	public createDocument(fields: { [x: string]: string }, clearTextFields: Function): Promise<void> {
		return new Promise((resolve, reject) => {
			if (Object.values(fields).every((field) => !!field) && !this.documentWasCreated) {
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
		this.fields = this.fieldNames.reduce((acc, fieldName, index) => ({ ...acc, [fieldName]: '' }), {});
		this.documentWasCreated = false;
	}
}

export default FillInputsController;
