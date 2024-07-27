import { AccessLevel, pageAccessMap, apiAccessMap } from "~/permissions"

const canAccess = (event, accessLevel: AccessLevel): boolean => {
	switch (accessLevel) {
		case AccessLevel.PUBLIC:
			return true
		case AccessLevel.STUDENT:
			return event.context.user != undefined
		case AccessLevel.VOLUNTEER:
			return event.context.volunteerLevel != undefined
		case AccessLevel.ADMIN:
			return event.context.adminLevel != undefined
		default:
			return false
	}
}

export default defineEventHandler((event) => {
	const requestPath = getRequestURL(event).pathname
	if (pageAccessMap[requestPath]) {
		const requiredAccessLevel: AccessLevel = pageAccessMap[requestPath]
		if (!canAccess(event, requiredAccessLevel)) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	} else if (apiAccessMap[requestPath] && apiAccessMap[requestPath][event.method]) {
		const requiredAccessLevel: AccessLevel = apiAccessMap[requestPath][event.method]
		if (!canAccess(event, requiredAccessLevel)) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	}
	console.log("AUTHORIZING" + ` ${event.method} ${requestPath}`)
})
