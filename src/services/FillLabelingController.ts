/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

class FillLabelingController {
	private readonly setNve: Function;
	private readonly setEan: Function;
	private readonly setSn: Function;
	private readonly createNewDocument: Function;
	private fields: { [key: string]: string };

	private documentWasCreated: boolean = false;

	constructor(setNve: Function, setEan: Function, setSn: Function, createNewDocument: Function) {
		this.setNve = setNve;
		this.setEan = setEan;
		this.setSn = setSn;
		this.createNewDocument = createNewDocument;

		this.fields = {
			nve: '',
			ean: '',
			sn: '',
		};
	}

	public handleChange(value: string, clearTextFields: Function): void {
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

		this.createDocument(clearTextFields);
	}

	private createDocument(clearTextFields: Function) {
		if (this.fields.nve && this.fields.ean && this.fields.sn && !this.documentWasCreated) {
			this.documentWasCreated = true;
			setTimeout(async () => {
				try {
					await this.createNewDocument(this.fields);
				} finally {
					clearTextFields && clearTextFields();
				}
			}, 500);
		}
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