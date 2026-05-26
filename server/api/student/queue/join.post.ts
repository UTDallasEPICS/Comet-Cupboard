import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { generateQueueName } from "#server/utils/queueNames"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	let queueEntry: { netID: string; position: number; publicCode: string } = {
		netID,
		position: -1,
		publicCode: "",
	}
	await prisma.$transaction(async (tx) => {
		const existingEntry = await tx.queueEntry.findUnique({
			where: { netID },
		})
		if (existingEntry) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "User is already in the queue" })
		}

		const existingCart = await tx.cart.findUnique({
			where: { cartID: netID },
		})
		if (existingCart) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "User already has a cart" })
		}

		const maxPositionEntry = await tx.queueEntry.findFirst({
			orderBy: { position: "desc" },
		})
		const tempQueueNumber = maxPositionEntry ? maxPositionEntry.position + 1 : 1

		// you know what I think colliding queue names can be funny
		queueEntry = await tx.queueEntry.create({
			data: {
				netID: netID,
				publicCode: generateQueueName(),
				position: tempQueueNumber,
			},
		})
	})

	publishEvent(
		createEvent("queue.entryAdded", {
			position: queueEntry.position,
			publicCode: queueEntry.publicCode,
			netID: queueEntry.netID,
		})
	)

	return "User has been added to the queue"
})
