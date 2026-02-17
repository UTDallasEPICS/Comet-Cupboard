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
			event.context.permissions = {
				...event.context.permissions,
				["STUDENT"]: true,
				["VOLUNTEER"]: true,
				["ADMIN"]: true,
			}
			// //Student will get shopping permissions after queue. Otherwise, restricted to PUBLIC permissions like queue and login
			// if (user.QueueEntry && user.QueueEntry.state == "INSIDE") {
			// 	event.context.permissions[AccessPermission.SHOPPING] = true
			// } else {
			// 	event.context.permissions[AccessPermission.SHOPPING] = false
			// }

			// if (user.Volunteer) {
			// 	event.context.permissions[AccessPermission.SHOPPING] = true
			// 	event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT] = true
			// 	event.context.permissions[AccessPermission.VERIFY_CART] = true
			// }
			// if (user.Admin) {
			// 	event.context.permissions[AccessPermission.SHOPPING] = true
			// 	event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT] = true
			// 	event.context.permissions[AccessPermission.VERIFY_CART] = true
			// 	event.context.permissions[AccessPermission.ADMIN] = true
			// }
		}
	}
})
