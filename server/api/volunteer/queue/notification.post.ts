import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { publishEvent } from "#server/utils/eventBus"
import { createEvent } from "#server/utils/eventsFactory"

const schema = z
	.object({
		publicCode: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { publicCode } = await validateBody(event, schema)

	const queueEntry = await prisma.queueEntry.findUnique({ where: { publicCode } })
	if (!queueEntry) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Queue session not found" })
	}

	const sentAt = new Date()

	const notification = await prisma.queueEntry.update({
		where: { publicCode },
		data: {
			queuePingSentAt: sentAt,
			queuePingAcknowledgedAt: null,
			queuePingAcknowledgementMessage: null,
		},
	})

	publishEvent(createEvent("queue.notification.sent", { publicCode, sentAt: sentAt }))
	return notification
})
