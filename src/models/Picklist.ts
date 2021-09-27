/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import { PicklistScanStatus, ShipmentType, StatusApproved } from '../enums';

class Picklist {
	public picklistId: number = 0;
	public carrierId: number = 0;
	public directApproveIO: boolean = false;
	public loadingListId: number = 0;
	public numPallets: number = 0;
	public ramp: number = 0;
	public shipmentType: ShipmentType = ShipmentType.S;
	public statusApproved: StatusApproved = StatusApproved.CREATED;
	public scanStatus: PicklistScanStatus = PicklistScanStatus.NOT_FOUND;
	public rampName: string = '\u2014';

	constructor(picklist: Picklist) {
		this.picklistId = picklist.picklistId || 0;
		this.carrierId = picklist.carrierId || 0;
		this.directApproveIO = picklist.directApproveIO || false;
		this.loadingListId = picklist.loadingListId || 0;
		this.numPallets = picklist.numPallets || 0;
		this.ramp = picklist.ramp || 0;
		this.shipmentType = picklist.shipmentType || ShipmentType.S;
		this.statusApproved = picklist.statusApproved || StatusApproved.CREATED;
		this.scanStatus = picklist.scanStatus || PicklistScanStatus.NOT_FOUND;
		this.rampName = picklist.rampName || '\u2014';
	}
}

export default Picklist;
