enum AccessPermission {
	PUBLIC = "PUBLIC",
	SHOPPING = "SHOPPING",
	INVENTORY_MANAGEMENT = "INVENTORY_MANAGEMENT",
	VERIFY_CART = "VERIFY_CART",
	ADMIN = "ADMIN",
}

/* 
	NOTE: 
		This does not check for extraneous APIs. Clean it yourself. Best to organize it in order when you expand all server/api folders.
		Also, careful when using / and /index. Include both to be safe.
*/

const pageAccessMap: { [route: string]: AccessPermission } = {
	"/": AccessPermission.PUBLIC,
	"/index": AccessPermission.PUBLIC,
	"/shopping": AccessPermission.SHOPPING,
	"/questionaire": AccessPermission.SHOPPING,
	"/inventory-management": AccessPermission.INVENTORY_MANAGEMENT,
	"/verify-cart": AccessPermission.VERIFY_CART,
	"/data": AccessPermission.ADMIN,
	"/admin/source": AccessPermission.ADMIN,
	"/admin/volunteer": AccessPermission.ADMIN,
	"/queue": AccessPermission.PUBLIC,
}
const apiAccessMap: { [route: string]: { [method: string]: AccessPermission } } = {
	"/api/login": {
		POST: AccessPermission.PUBLIC,
	},
	"/api/updatePermissions": {
		GET: AccessPermission.PUBLIC,
	},
	"/api/cart/cart": {
		GET: AccessPermission.SHOPPING,
		PUT: AccessPermission.SHOPPING,
		DELETE: AccessPermission.SHOPPING,
	},
	"/api/cart/cartItem": {
		DELETE: AccessPermission.SHOPPING,
		POST: AccessPermission.SHOPPING,
	},
	"/api/controls/categories": {
		GET: AccessPermission.SHOPPING,
	},
	"/api/controls/filteredItems": {
		GET: AccessPermission.SHOPPING,
	},
	"/api/controls/sources": {
		GET: AccessPermission.INVENTORY_MANAGEMENT,
	},
	"/api/inventory/deal": {
		DELETE: AccessPermission.INVENTORY_MANAGEMENT,
		PUT: AccessPermission.INVENTORY_MANAGEMENT,
	},
	"/api/inventory/item": {
		PUT: AccessPermission.INVENTORY_MANAGEMENT,
		DELETE: AccessPermission.ADMIN,
	},
	"/api/inventory/itemCountChanges": {
		POST: AccessPermission.INVENTORY_MANAGEMENT,
	},
	"/api/inventory/items": {
		GET: AccessPermission.SHOPPING,
	},
	"/api/verification/cartRequestVerification": {
		POST: AccessPermission.SHOPPING,
	},
	"/api/verification/cartRequestVerificationResponseWaiting": {
		GET: AccessPermission.SHOPPING,
	},
	"/api/verification/cartVerificationAction": {
		POST: AccessPermission.VERIFY_CART,
	},
	"/api/verification/pendingCart": {
		GET: AccessPermission.VERIFY_CART,
	},
	"/api/verification/pendingCarts": {
		GET: AccessPermission.VERIFY_CART,
	},
	"/api/verification/pendingCartsUpdate": {
		GET: AccessPermission.VERIFY_CART,
	},
	"/api/queue": {
		POST: AccessPermission.PUBLIC,
		GET: AccessPermission.PUBLIC,
		DELETE: AccessPermission.PUBLIC,
		PUT: AccessPermission.PUBLIC,
	},
	// DATA APIS
}

export { AccessPermission, pageAccessMap, apiAccessMap }
