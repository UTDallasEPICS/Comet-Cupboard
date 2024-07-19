import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	event.context.prisma = prisma
	const cookies = parseCookies(event)
	if (cookies && cookies.netID) {
		const netID: string = cookies.netID
		const user = await event.context.prisma.user.findUnique({
			where: {
				netID: netID,
			},
			include: { Volunteer: true, Admin: true, Cart: { include: { CartItems: true } } },
		})
		if (user) {
			event.context.user = user
			if (user.Volunteer) {
				event.context.volunteerLevel = true
			}
			if (user.Admin) {
				event.context.volunteerLevel = true
				event.context.adminLevel = true
			}
		}
	}
})
