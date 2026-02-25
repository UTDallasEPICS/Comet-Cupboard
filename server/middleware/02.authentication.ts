import type { Prisma } from "@prisma/client"
import { prisma } from "#server/utils/prismaUtil"

type UserInfo = Prisma.UserGetPayload<{
	include: { Student: true; Volunteer: true; Admin: true }
}>
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
			include: {
				Student: true,
				Volunteer: true,
				Admin: true,
			},
		})

		if (user) {
			event.context.user = user
			if (user.Student) {
				event.context.permissions[AccessPermission.STUDENT] = true
			}
			if (user.Volunteer) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
			}
			if (user.Admin) {
				event.context.permissions[AccessPermission.STUDENT] = true
				event.context.permissions[AccessPermission.VOLUNTEER] = true
				event.context.permissions[AccessPermission.ADMIN] = true
			}
		}
	}
})
