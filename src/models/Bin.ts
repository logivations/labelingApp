/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/


class Bin {
	public id: number = 0;
	public rackId: number = 0;
	public text?: string = '';

	constructor(bin: Bin) {
		this.id = bin.id;
		this.rackId = bin.rackId;
		this.text = bin.text;
	}

	public serialize() {
		return {
			id: this.id,
			rackId: this.rackId,
			text: this.text,
		};
	}

	public equals(rackId: number | string, binId: number | string): boolean {
		return this.getBinId() === Number(binId) && this.getRackId() === Number(rackId);
	}

	public getName(): string | undefined {
		return this.text;
	}

	public getRackId(): number {
		return this.rackId;
	}

	public getBinId(): number {
		return this.id;
	}
}

export default Bin;
