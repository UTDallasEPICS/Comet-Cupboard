import { PrismaClient } from "@prisma/client"
import { AccessPermission } from "~/permissions"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	event.context.prisma = prisma
	event.context.permissions = {}
	event.context.permissions[AccessPermission.PUBLIC] = true
	const cookies = parseCookies(event)
	if (cookies && cookies.netID) {
		const netID: string = cookies.netID
		const user = await event.context.prisma.user.findUnique({
			where: {
				netID: netID,
			},
			include: { Student: true, Volunteer: true, Admin: true, Cart: { include: { CartItems: { include: { Item: { include: { Deal: true } } } } } } },
		})

		if (user) {
			event.context.user = user
			event.context.permissions[AccessPermission.SHOPPING] = true
			if (user.Student) {
				event.context.permissions[AccessPermission.SHOPPING_ACTION] = true
			}
			if (user.Volunteer) {
				event.context.permissions[AccessPermission.SHOPPING_ACTION] = true
				event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT] = true
				event.context.permissions[AccessPermission.VERIFY_CART] = true
			}
			if (user.Admin) {
				event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT] = true
				event.context.permissions[AccessPermission.VERIFY_CART] = true
				event.context.permissions[AccessPermission.ADMIN] = true
			}
		}
	}
})
