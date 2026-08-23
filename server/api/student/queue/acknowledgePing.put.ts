import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { publishEvent } from "#server/utils/eventBus"
import { createEvent } from "#server/utils/eventsFactory"

const schema = z
	.object({
		timeEstimateMinutes: z.int().positive().optional(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { timeEstimateMinutes } = await validateBody(event, schema)

	const publicCode = event.context.userSession.publicCode
	const queueEntry = await prisma.queueEntry.findUnique({
		where: { publicCode },
		include: { userSession: { select: { userID: true } } },
	})
	if (!queueEntry) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Queue session not found" })
	}
	if (!queueEntry.queuePingSentAt) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Queue ping has not been sent yet" })
	}

	const message = timeEstimateMinutes ? `Ack! I'll be there in ${timeEstimateMinutes} minutes.` : "Ack!"
	const queuePingAcknowledgedAt = new Date()

	const updatedQueueEntry = await prisma.queueEntry.update({
		where: { publicCode },
		data: {
			queuePingAcknowledgedAt: queuePingAcknowledgedAt,
			queuePingAcknowledgementMessage: message,
		},
	})

	publishEvent(
		createEvent("queue.notification.acknowledged", {
			publicCode,
			userID: queueEntry.userSession.userID,
			acknowledgedAt: queuePingAcknowledgedAt,
			acknowledgementMessage: message,
		})
	)
	return updatedQueueEntry
})
