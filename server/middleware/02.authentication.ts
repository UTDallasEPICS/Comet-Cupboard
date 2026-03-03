import type { User } from "../../prisma/generated/prisma/client"
import { RoleType } from "../../prisma/generated/prisma/client"
import { prisma } from "#server/utils/prismaUtil"

type UserInfo = User
declare module "h3" {
	interface H3EventContext {
		permissions: { [id: string]: boolean }
		user: UserInfo
	}
}

export default defineEventHandler(async (event) => {
	event.context.permissions = {}
	event.context.permissions[AccessPermission.PUBLIC] = true
	const cookies = parseCookies(event)
	if (cookies && cookies.netID) {
		const netID: string = cookies.netID
		const user = await prisma.user.findUnique({
			where: {
				netID: netID,
			},
		})

		if (user) {
			event.context.user = user
			if (user.role === RoleType.STUDENT) {
				event.context.permissions[AccessPermission.STUDENT] = true
			}
			if (user.role === RoleType.VOLUNTEER) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
			}
			if (user.role === RoleType.ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
			}
			if (user.role === RoleType.HEAD_ADMIN) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
				event.context.permissions[AccessPermission.HEAD_ADMIN] = true
			}
		}
	}
})
