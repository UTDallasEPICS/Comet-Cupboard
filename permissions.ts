import fs from "fs"
import path from "path"

const apiFolder = "server/api"
const pageFolder = "pages"

enum AccessLevel {
	PUBLIC = 0,
	STUDENT = 1,
	VOLUNTEER = 2,
	ADMIN = 3,
}

const pageAccessMap: { [route: string]: AccessLevel } = {
    // PUBLIC PAGES
    "/": AccessLevel.PUBLIC,
    "/donation": AccessLevel.PUBLIC,
    // STUDENT PAGES
    "/catalog": AccessLevel.STUDENT,
    "/cart": AccessLevel.STUDENT,
    "/questionaire": AccessLevel.STUDENT,
    // VOLUNTEER PAGES
    "/inventory/add-item": AccessLevel.VOLUNTEER,
    "/inventory/delete-item-confirmation": AccessLevel.VOLUNTEER,
    "/inventory/edit-item-deal": AccessLevel.VOLUNTEER,
    "/inventory/edit-item": AccessLevel.VOLUNTEER,
    "/inventory/inventory": AccessLevel.VOLUNTEER,
    "/verify-cart": AccessLevel.VOLUNTEER,
    // ADMIN PAGES
    "/data-analytics": AccessLevel.ADMIN
}
const apiAccessMap: { [route: string]: { [method: string]: AccessLevel } } = {
    // PUBLIC APIS
    "/api/login": {
        "POST": AccessLevel.PUBLIC
    },
    // // STUDENT APIS
    "/api/inventory/items": {
        "GET": AccessLevel.STUDENT
    },
    "/api/cart/cart": {
        "GET": AccessLevel.STUDENT,
        "POST": AccessLevel.STUDENT
    },
    "/api/cart/cartItem": {
        "POST": AccessLevel.STUDENT,
        "DELETE": AccessLevel.STUDENT
    },
    // // VOLUNTEER APIS
    "/api/inventory/item": {
        "GET": AccessLevel.VOLUNTEER,
        "POST": AccessLevel.VOLUNTEER,
        "PUT": AccessLevel.VOLUNTEER,
        "DELETE": AccessLevel.VOLUNTEER
    },
    // ADMIN APIS
}

// ********************************************************************************
// this is just to check if all permissions for pages and apis are covered
const getAllLeafFilePaths = (folder: string, existingPaths: Array<string>) => {
	fs.readdirSync(folder).forEach((file) => {
		const filePath = path.join(folder, file).replaceAll("\\", "/")
		const stat = fs.statSync(filePath)
		if (stat.isFile()) {
			existingPaths.push(filePath.replaceAll("\\", "/"))
		} else if (stat.isDirectory()) {
			getAllLeafFilePaths(filePath, existingPaths)
		}
	})
	return existingPaths
}

// at this point, it looks like 'pages/cart.vue', want /cart
const pages = getAllLeafFilePaths(pageFolder, []).map((route) => {
	const slashIndex = route.indexOf("/")
	const extensionIndex = route.lastIndexOf(".")
	return route.substring(slashIndex, extensionIndex)
})
// at this point, it looks like 'server/api/cart/cart.get.ts', want /api/cart/cart as well as the HTTP method
const apis = getAllLeafFilePaths(apiFolder, []).map((route) => {
	const slashIndex = route.indexOf("/")
	const extensionIndex = route.lastIndexOf(".")
	const methodIndex = route.lastIndexOf(".", extensionIndex - 1)
	return { route: route.substring(slashIndex, methodIndex), method: route.substring(methodIndex + 1, extensionIndex).toUpperCase() }
})

// TODO: probably should check for index page and index api

const missedPages = pages.filter((route) => {
	return pageAccessMap[route] == undefined
})
const missedApis = apis.filter((route) => {
	return apiAccessMap[route.route] == undefined || apiAccessMap[route.route][route.method] == undefined
})
if (missedPages.length != 0) {
    console.log("Missing page authorization levels")
    missedPages.forEach(page => console.log(`${page}`))
}
if (missedApis.length != 0) {
    console.log("Missing api authorization levels")
    missedApis.forEach(api => console.log(`${api.method} ${api.route}`))
}
// ********************************************************************************

export { AccessLevel, pageAccessMap, apiAccessMap }
