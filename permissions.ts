enum AccessLevel {
	PUBLIC = "PUBLIC",
	STUDENT = "STUDENT",
	VOLUNTEER = "VOLUNTEER",
	ADMIN = "ADMIN",
}

const pageAccessMap: { [route: string]: AccessLevel } = {
	// PUBLIC PAGES
	"/": AccessLevel.PUBLIC,
	"/donation": AccessLevel.PUBLIC,
	// STUDENT PAGES
	"/catalog": AccessLevel.STUDENT,
	"/cart": AccessLevel.STUDENT,
	"/questionaire": AccessLevel.STUDENT,
	"/request-verify-cart": AccessLevel.STUDENT,
	// VOLUNTEER PAGES
	"/inventory/add-item": AccessLevel.VOLUNTEER,
	"/inventory/delete-item-confirmation": AccessLevel.VOLUNTEER,
	"/inventory/edit-item-deal": AccessLevel.VOLUNTEER,
	"/inventory/edit-item": AccessLevel.VOLUNTEER,
	"/inventory/inventory": AccessLevel.VOLUNTEER,
	"/verify-cart": AccessLevel.VOLUNTEER,
	// ADMIN PAGES
	"/data-analytics": AccessLevel.ADMIN,
}
const apiAccessMap: { [route: string]: { [method: string]: AccessLevel } } = {
	// PUBLIC APIS
	"/api/login": {
		POST: AccessLevel.PUBLIC,
	},
	// // STUDENT APIS
	"/api/inventory/items": {
		GET: AccessLevel.STUDENT,
	},
	"/api/cart/cart": {
		GET: AccessLevel.STUDENT,
		POST: AccessLevel.STUDENT,
	},
	"/api/cart/cartItem": {
		DELETE: AccessLevel.STUDENT,
	},
	"/api/cart/incrementCartItem": {
		POST: AccessLevel.STUDENT,
	},
	"/api/cart/decrementCartItem": {
		POST: AccessLevel.STUDENT,
	},
	// // VOLUNTEER APIS
	"/api/inventory/item": {
		GET: AccessLevel.VOLUNTEER,
		POST: AccessLevel.VOLUNTEER,
		PUT: AccessLevel.VOLUNTEER,
		DELETE: AccessLevel.VOLUNTEER,
	},
	// ADMIN APIS
}

export { AccessLevel, pageAccessMap, apiAccessMap }
