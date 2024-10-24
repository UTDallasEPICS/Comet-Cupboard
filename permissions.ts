enum AccessPermission {
	PUBLIC = "PUBLIC",
	SHOPPING = "SHOPPING",
	SHOPPING_ACTION = "SHOPPING_ACTION",
	INVENTORY_MANAGEMENT = "INVENTORY_MANAGEMENT",
	VERIFY_CART = "VERIFY_CART",
	ADMIN = "ADMIN",
}

const pageAccessMap: { [route: string]: AccessPermission } = {
	"/": AccessPermission.PUBLIC,
	"/index": AccessPermission.PUBLIC,
	"/shopping": AccessPermission.SHOPPING,
	"/questionaire": AccessPermission.SHOPPING,
	"/inventory-management": AccessPermission.INVENTORY_MANAGEMENT,
	"/verify-cart": AccessPermission.VERIFY_CART,
	"/data": AccessPermission.ADMIN,
}
const apiAccessMap: { [route: string]: { [method: string]: AccessPermission } } = {
	"/api/login": {
		POST: AccessPermission.PUBLIC,
	},
	"/api/updatePermissions": {
		GET: AccessPermission.PUBLIC,
	},
	"/api/cart/cart": {
		GET: AccessPermission.SHOPPING_ACTION,
		POST: AccessPermission.SHOPPING_ACTION,
	},
	"/api/cart/cartItem": {
		DELETE: AccessPermission.SHOPPING_ACTION,
		POST: AccessPermission.SHOPPING_ACTION,
	},
	"/api/inventory/deal": {
		DELETE: AccessPermission.INVENTORY_MANAGEMENT,
		POST: AccessPermission.INVENTORY_MANAGEMENT,
	},
	"/api/inventory/item": {
		POST: AccessPermission.INVENTORY_MANAGEMENT,
		PUT: AccessPermission.INVENTORY_MANAGEMENT,
		DELETE: AccessPermission.ADMIN,
	},
	"/api/inventory/items": {
		GET: AccessPermission.SHOPPING,
	},
	"/api/verification/cartRequestVerification": {
		POST: AccessPermission.SHOPPING_ACTION,
	},
	"/api/verification/cartRequestVerificationResponseWaiting": {
		GET: AccessPermission.SHOPPING_ACTION,
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
	// DATA APIS
}

export { AccessPermission, pageAccessMap, apiAccessMap }
