import { prisma } from "#server/utils/prismaUtil"
import { constructCartSessionRemovedEvent } from "~~/server/utils/eventsUtil"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	try {
		await prisma.cart.delete({
			where: {
				cartID: netID,
			},
		})

		await broadcastToVolunteers(JSON.stringify(constructCartSessionRemovedEvent(netID)))

		return `Successfully deleted cart ${netID}`
	} catch (error: any) {
		if (error.code === "P2025") {
			throw createError({ statusCode: 404, statusMessage: "Cart not found" })
		}
		throw createError({ statusCode: 500, statusMessage: "Unable to delete cart" })
	}
})
