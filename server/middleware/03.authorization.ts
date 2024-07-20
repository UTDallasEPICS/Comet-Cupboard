import { AccessLevel, pageAccessMap, apiAccessMap } from "~/permissions"

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
	if (pageAccessMap[event.path]) {
		const requiredAccessLevel: AccessLevel = pageAccessMap[event.path]
		if (!canAccess(event, requiredAccessLevel)) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	} else if (apiAccessMap[event.path] && apiAccessMap[event.path][event.method]) {
		const requiredAccessLevel: AccessLevel = apiAccessMap[event.path][event.method]
		if (!canAccess(event, requiredAccessLevel)) {
			throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
		}
	}
	console.log("AUTHORIZING" + ` ${event.method} ${event.path}`)
})
