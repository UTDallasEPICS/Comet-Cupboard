import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { Prisma } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	try {
		const existingEntry = await prisma.queueEntry.delete({
			where: { publicCode: publicCode },
		})

		publishEvent(
			createEvent("queue.entryRemoved", {
				position: existingEntry.position,
				publicCode: existingEntry.publicCode,
				publicIcon: "", // don't want to join on UserSession here
			})
		)
		return "User has left the queue"
	} catch (error: unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User is not in the queue" })
		}
		throw error
	}
})
