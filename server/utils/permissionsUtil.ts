import fs from "fs"
import path from "path"
import { pageAccessMap, apiAccessMap } from "~/permissions"

const apiFolder = "server/api"
const pageFolder = "pages"

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
// actually, some will look like server/api/pendingCartsUpdate.ts, so account for GET server/api/pendingCartsUpdate
const apis = getAllLeafFilePaths(apiFolder, []).map((route) => {
	const slashIndex = route.indexOf("/")
	const extensionIndex = route.lastIndexOf(".")
	const methodIndex = route.lastIndexOf(".", extensionIndex - 1)
	// looks like server/api/pendingCartsUpdate.ts
	if (route.match(/\./g)?.length == 1) {
		return { route: route.substring(slashIndex, extensionIndex), method: "GET" }
	}
	// looks like server/api/cart/cart.get.ts
	else if (route.match(/\./g)?.length == 2) {
		return { route: route.substring(slashIndex, methodIndex), method: route.substring(methodIndex + 1, extensionIndex).toUpperCase() }
	} else {
		console.log("go rename your api route before I 💪🥊💥")
		return { route: "ERROR", method: "ERROR" }
	}
})

// TODO: probably should check for index page and index api
export const checkMissingPermissions = () => {
	const missedPages = pages.filter((route) => {
		return pageAccessMap[route] == undefined
	})
	const missedApis = apis.filter((route) => {
		return apiAccessMap[route.route] == undefined || apiAccessMap[route.route][route.method] == undefined
	})
	if (missedPages.length != 0) {
		console.log("Missing page authorization levels")
		missedPages.forEach((page) => console.log(`${page}`))
	}
	if (missedApis.length != 0) {
		console.log("Missing api authorization levels")
		missedApis.forEach((api) => console.log(`${api.method} ${api.route}`))
	}
}
