/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

enum StatusApproved {
	CREATED = 0,
	CALCULATED = 1,
	APPROVED = 2,
	IN_PROCESS = 3,
	TO_ON_HOLD = 4,
	IN_SCANNING = 5,
	SCANNED = 6,
	CLOSED = 7,
	CREATED_N0_RAMP = 8,
	TO_APPROVED = 9,
}

export default StatusApproved;
