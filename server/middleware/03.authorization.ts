enum AccessLevel {
	PUBLIC = 0,
	STUDENT = 1,
	VOLUNTEER = 2,
	ADMIN = 3,
}

const pageAccessMap = new Map<string, AccessLevel>()
const apiAccessMap = new Map<string, Map<string, AccessLevel>>() // Map to method, then to path
apiAccessMap.set("GET", new Map<string, AccessLevel>())
apiAccessMap.set("POST", new Map<string, AccessLevel>())
apiAccessMap.set("PUT", new Map<string, AccessLevel>())
apiAccessMap.set("DELETE", new Map<string, AccessLevel>())

// PUBLIC PAGES AND APIS
pageAccessMap.set("/", AccessLevel.PUBLIC)
pageAccessMap.set("/donation", AccessLevel.PUBLIC)
apiAccessMap.get("POST")?.set("/api/login", AccessLevel.PUBLIC)

// STUDENT PAGES AND APIS
pageAccessMap.set("/catalog", AccessLevel.STUDENT)
pageAccessMap.set("/cart", AccessLevel.STUDENT)
pageAccessMap.set("/questionaire", AccessLevel.STUDENT)
apiAccessMap.get("GET")?.set("/api/inventory/items", AccessLevel.STUDENT)
apiAccessMap.get("GET")?.set("/api/cart/cart", AccessLevel.STUDENT)
apiAccessMap.get("POST")?.set("/api/cart/cart", AccessLevel.STUDENT)
apiAccessMap.get("DELETE")?.set("/api/cart/cartItem", AccessLevel.STUDENT)
apiAccessMap.get("POST")?.set("/api/cart/cartItem", AccessLevel.STUDENT)

// VOLUNTEER PAGES AND APIS
pageAccessMap.set("/inventory/add-item", AccessLevel.VOLUNTEER)
pageAccessMap.set("/inventory/delete-item-confirmation", AccessLevel.VOLUNTEER)
pageAccessMap.set("/inventory/edit-item-deal", AccessLevel.VOLUNTEER)
pageAccessMap.set("/inventory/edit-item", AccessLevel.VOLUNTEER)
pageAccessMap.set("/inventory/inventory", AccessLevel.VOLUNTEER)
pageAccessMap.set("/verify-cart", AccessLevel.VOLUNTEER)
apiAccessMap.get("DELETE")?.set("/api/inventory/item", AccessLevel.VOLUNTEER)
apiAccessMap.get("POST")?.set("/api/inventory/item", AccessLevel.VOLUNTEER)
apiAccessMap.get("PUT")?.set("/api/inventory/item", AccessLevel.VOLUNTEER)
apiAccessMap.get("GET")?.set("/api/inventory/item", AccessLevel.VOLUNTEER)

// ADMIN PAGES AND APIS
pageAccessMap.set("/data-analytics", AccessLevel.ADMIN)
// apiAccessMap.set({}, AccessLevel.ADMIN)

const canAccess = (event, accessLevel: AccessLevel): boolean => {
	switch (accessLevel) {
		case AccessLevel.PUBLIC:
			return true
		case AccessLevel.STUDENT:
			return event.context.user.netID != undefined
		case AccessLevel.VOLUNTEER:
			return event.context.volunteerLevel != undefined
		case AccessLevel.ADMIN:
			return event.context.adminLevel != undefined
		default:
			return false
	}
}

export default defineEventHandler((event) => {
	console.log("AUTHORIZING" + ` ${event.method} ${event.path}`)
	if (pageAccessMap.get(event.path)) {
		console.log("checking page access")
		const requiredAccessLevel: AccessLevel = pageAccessMap.get(event.path)
		if (!canAccess(event, requiredAccessLevel)) {
			console.log("cannot access")
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	} else if (apiAccessMap.get(event.method)?.get(event.path)) {
		const requiredAccessLevel: AccessLevel = apiAccessMap.get(event.method).get(event.path)
		if (!canAccess(event, requiredAccessLevel)) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	}
})
