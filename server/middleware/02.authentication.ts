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
	const cookies = parseCookies(event)
	const sessionToken = cookies["better-auth.session-token"]
	if (sessionToken) {
		const authSession = await prisma.authSession.findUnique({
			where: {
				token: sessionToken,
			},
			include: {
				User: true,
			},
		})

		if (authSession && authSession.expiresAt > new Date()) {
			const userSession = await prisma.userSession.findUnique({
				where: {
					userID: authSession?.userID,
				},
				select: {
					publicCode: true,
					publicIcon: true,
				},
			})
			if (userSession) {
				event.context.userSession = {
					userID: authSession.User.userID,
					publicCode: userSession.publicCode,
					publicIcon: userSession.publicIcon,
					User: {
						userID: authSession.User.userID,
						displayName: authSession.User.displayName,
						role: authSession.User.role,
					},
				}
				if (authSession.User.role === RoleType.STUDENT) {
					event.context.permissions[AccessPermission.STUDENT] = true
				}
				if (authSession.User.role === RoleType.VOLUNTEER) {
					event.context.permissions[AccessPermission.STUDENT] = true
					event.context.permissions[AccessPermission.VOLUNTEER] = true
				}
				if (authSession.User.role === RoleType.ADMIN) {
					event.context.permissions[AccessPermission.STUDENT] = true
					event.context.permissions[AccessPermission.VOLUNTEER] = true
					event.context.permissions[AccessPermission.ADMIN] = true
				}
				if (authSession.User.role === RoleType.HEAD_ADMIN) {
					event.context.permissions[AccessPermission.STUDENT] = true
					event.context.permissions[AccessPermission.VOLUNTEER] = true
					event.context.permissions[AccessPermission.ADMIN] = true
					event.context.permissions[AccessPermission.HEAD_ADMIN] = true
				}
			}
		}
	}
})
