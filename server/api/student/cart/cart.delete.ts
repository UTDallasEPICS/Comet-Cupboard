import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { Prisma } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	try {
		await prisma.cart.delete({
			where: {
				cartID: netID,
			},
		})
		publishEvent(createEvent("cartSession.removed", { cartID: netID }))

		return "Successfully deleted cart"
	} catch (error: unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
		}
		throw error
	}
})
