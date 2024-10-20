import type { AccessPermission } from "~/permissions"
import { pageAccessMap, apiAccessMap } from "~/permissions"

export default defineEventHandler((event) => {
	const requestPath = getRequestURL(event).pathname
	if (pageAccessMap[requestPath]) {
		const requiredAccessPermission: AccessPermission = pageAccessMap[requestPath]
		if (!event.context.permissions[requiredAccessPermission]) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	} else if (apiAccessMap[requestPath] && apiAccessMap[requestPath][event.method]) {
		const requiredAccessPermission: AccessPermission = apiAccessMap[requestPath][event.method]
		if (!event.context.permissions[requiredAccessPermission]) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	}
	console.log("AUTHORIZING" + ` ${event.method} ${requestPath}`)
})
