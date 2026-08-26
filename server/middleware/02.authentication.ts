import { RoleType } from "../../prisma/generated/prisma/client"
import { prisma } from "#server/utils/db"

declare module "h3" {
	interface H3EventContext {
		permissions: { [id: string]: boolean }
		userSession: {
			userID: string
			publicCode: string
			publicIcon: string
			user: {
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
				user: true,
			},
		})

		if (userSession) {
			event.context.userSession = {
				userID: userID,
				publicCode: userSession.publicCode,
				publicIcon: userSession.publicIcon,
				user: {
					userID: userSession.user.userID,
					displayName: userSession.user.displayName,
					role: userSession.user.role,
				},
			}
			if (userSession.user.role === RoleType.STUDENT) {
				event.context.permissions[AccessPermission.STUDENT] = true
			}
			if (userSession.user.role === RoleType.VOLUNTEER) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
			}
			if (userSession.user.role === RoleType.ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
			}
			if (userSession.user.role === RoleType.HEAD_ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
				event.context.permissions[AccessPermission.HEAD_ADMIN] = true
			}
		}
	}
})
