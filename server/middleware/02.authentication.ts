import { RoleType } from "../../prisma/generated/prisma/client"
import { prisma } from "#server/utils/db"

declare module "h3" {
	interface H3EventContext {
		permissions: { [id: string]: boolean }
		userSession: {
			userID: string
			publicCode: string
			publicIcon: string
			User: {
				userID: string
				displayName: string
				role: RoleType
			}
		}
	}
}

export default defineSafeHandler(async (event) => {
	event.context.permissions = {}
	event.context.permissions[AccessPermission.PUBLIC] = true

	const session = await getUserSession(event)
	const isLoggedIn = session?.user !== undefined

	if (isLoggedIn) {
		const userID = session.secure.userID
		const userSession = await prisma.userSession.findUnique({
			where: {
				userID: userID,
			},
			include: {
				User: true,
			}
		})

		if (userSession) {
			event.context.userSession = {
				userID: userID,
				publicCode: userSession.publicCode,
				publicIcon: userSession.publicIcon,
				User: {
					userID: userSession.User.userID,
					displayName: userSession.User.displayName,
					role: userSession.User.role,
				},
			}
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
