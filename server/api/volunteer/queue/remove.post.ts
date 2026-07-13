import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		publicCode: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { publicCode } = await validateBody(event, schema)

	try {
		const queueEntry = await prisma.queueEntry.delete({
			where: { publicCode },
		})

		publishEvent(
			createEvent("queue.entryRemoved", {
				position: queueEntry.position,
				publicCode: queueEntry.publicCode,
				publicIcon: "", // don't want to join on UserSession here
			})
		)

		return "User has been removed from the queue"
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Queue entry not found" })
		}
		throw error
	}
})
