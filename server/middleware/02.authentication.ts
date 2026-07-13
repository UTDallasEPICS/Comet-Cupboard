import type { Prisma } from "../../prisma/generated/prisma/client"
import { RoleType } from "../../prisma/generated/prisma/client"
import { prisma } from "#server/utils/db"

type UserSessionWithUser = Prisma.UserSessionGetPayload<{
	include: {
		User: true
	}
}>

declare module "h3" {
	interface H3EventContext {
		permissions: { [id: string]: boolean }
		userSession: UserSessionWithUser
	}
}

export default defineSafeHandler(async (event) => {
	event.context.permissions = {}
	event.context.permissions[AccessPermission.PUBLIC] = true
	const cookies = parseCookies(event)
	if (cookies && cookies.userID) {
		const userID: string = cookies.userID

		const userSession: UserSessionWithUser | null = await prisma.userSession.findUnique({
			where: {
				userID: userID,
			},
			include: {
				User: true,
			},
		})

		if (userSession) {
			event.context.userSession = userSession
			if (userSession.User.role === RoleType.STUDENT) {
				event.context.permissions[AccessPermission.STUDENT] = true
			}
			if (userSession.User.role === RoleType.VOLUNTEER) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
			}
			if (userSession.User.role === RoleType.ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
			}
			if (userSession.User.role === RoleType.HEAD_ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
				event.context.permissions[AccessPermission.HEAD_ADMIN] = true
			}
		}
	}
})
