import { prisma } from "#server/utils/db"
import { constructQueueEntryAddedEvent, constructQueueEntryAddedVolunteerEvent } from "~~/server/utils/eventsUtil"
import { StatusCodes } from "http-status-codes"

let temporaryQueuePublicCode: number = 0

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	const existingEntry = await prisma.queueEntry.findUnique({
		where: { netID },
	})
	if (existingEntry) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `User with netID ${netID} is already in the queue` })
	}
	const existingCart = await prisma.cart.findUnique({
		where: { cartID: netID },
	})
	if (existingCart) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `User with netID ${netID} already has a cart` })
	}
	const maxPositionEntry = await prisma.queueEntry.findFirst({
		orderBy: { position: "desc" },
	})
	const tempQueueNumber = maxPositionEntry ? maxPositionEntry.position + 1 : 1

	const queueEntry = await prisma.queueEntry.create({
		data: {
			netID: netID,
			publicCode: temporaryQueuePublicCode.toString(),
			position: tempQueueNumber,
		},
	})

	temporaryQueuePublicCode += 1

	await broadcastToStudents(
		JSON.stringify(
			constructQueueEntryAddedEvent({
				position: queueEntry.position,
				publicCode: queueEntry.publicCode,
			})
		)
	)
	await broadcastToVolunteers(
		JSON.stringify(
			constructQueueEntryAddedVolunteerEvent({
				position: queueEntry.position,
				publicCode: queueEntry.publicCode,
				netID: queueEntry.netID,
			})
		)
	)

	return `User with netID ${netID} has been added to the queue at position ${queueEntry.position}`
})
