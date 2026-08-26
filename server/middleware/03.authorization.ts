import { AccessPermission } from "#shared/utils/permissions"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

export default defineSafeHandler((event) => {
	const requestPath = getRequestURL(event).pathname
	let requiredAccessPermission: AccessPermission = AccessPermission.PUBLIC
	if (requestPath.startsWith("/api/student") || requestPath.startsWith("/student")) {
		requiredAccessPermission = AccessPermission.STUDENT
	} else if (requestPath.startsWith("/api/volunteer") || requestPath.startsWith("/volunteer")) {
		requiredAccessPermission = AccessPermission.VOLUNTEER
	} else if (requestPath.startsWith("/api/admin") || requestPath.startsWith("/admin")) {
		requiredAccessPermission = AccessPermission.ADMIN
	} else if (requestPath.startsWith("/api/head-admin") || requestPath.startsWith("/head-admin")) {
		requiredAccessPermission = AccessPermission.HEAD_ADMIN
	} else if (requestPath.startsWith("/api/_auth")) {
		requiredAccessPermission = AccessPermission.PUBLIC
	}

	if (!event.context.permissions[requiredAccessPermission]) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: ReasonPhrases.FORBIDDEN })
	}
})
