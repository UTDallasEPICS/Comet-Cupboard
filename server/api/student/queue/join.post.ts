import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	let queueEntry = {
		position: -1,
		publicCode: "",
		publicIcon: "",
	}
	await prisma.$transaction(async (tx) => {
		const existingEntry = await tx.queueEntry.findUnique({
			where: { publicCode: publicCode },
		})
		if (existingEntry) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "User is already in the queue" })
		}

		const existingCart = await tx.cart.findUnique({
			where: { publicCode: publicCode },
		})
		if (existingCart) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "User already has a cart" })
		}

		const maxPositionEntry = await tx.queueEntry.findFirst({
			orderBy: { position: "desc" },
		})
		const tempQueueNumber = maxPositionEntry ? maxPositionEntry.position + 1 : 1

		const foundQueueEntry = await tx.queueEntry.create({
			data: {
				publicCode: publicCode,
				position: tempQueueNumber,
			},
			include: {
				UserSession: {
					select: {
						publicCode: true,
						publicIcon: true,
					},
				},
			},
		})
		queueEntry = {
			position: foundQueueEntry.position,
			publicCode: foundQueueEntry.publicCode,
			publicIcon: foundQueueEntry.UserSession.publicIcon,
		}
	})

	publishEvent(
		createEvent("queue.entryAdded", {
			position: queueEntry.position,
			publicCode: queueEntry.publicCode,
			publicIcon: queueEntry.publicIcon,
		})
	)

	return "User has been added to the queue"
})
