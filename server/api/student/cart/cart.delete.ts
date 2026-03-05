import { prisma } from "#server/utils/db"
import { constructCartSessionRemovedEvent } from "#server/utils/eventsFactory"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
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
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
		}
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Unable to delete cart" })
	}
})
