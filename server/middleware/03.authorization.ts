import { AccessPermission } from "#shared/utils/permissions"
import { StatusCodes } from "http-status-codes"

export default defineEventHandler((event) => {
	const requestPath = getRequestURL(event).pathname
	let requiredAccessPermission: AccessPermission = AccessPermission.PUBLIC
	if (requestPath.startsWith("/api/admin") || requestPath.startsWith("/admin")) {
		requiredAccessPermission = AccessPermission.ADMIN
	} else if (requestPath.startsWith("/api/volunteer") || requestPath.startsWith("/volunteer")) {
		requiredAccessPermission = AccessPermission.VOLUNTEER
	} else if (requestPath.startsWith("/api/student") || requestPath.startsWith("/student")) {
		requiredAccessPermission = AccessPermission.STUDENT
	}

	if (!event.context.permissions[requiredAccessPermission]) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: "Unauthorized" })
	}
})
