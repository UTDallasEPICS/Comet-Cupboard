import { prisma } from "#server/utils/db"
import { constructQueueEntryRemovedEvent, constructQueueEntryRemovedVolunteerEvent } from "~~/server/utils/eventsFactory"
import { StatusCodes } from "http-status-codes"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	const existingEntry = await prisma.queueEntry.findUnique({
		where: { netID },
	})
	if (!existingEntry) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `User with netID ${netID} is not in the queue` })
	}

	await prisma.queueEntry.delete({
		where: { netID },
	})

	await broadcastToStudents(
		JSON.stringify(
			constructQueueEntryRemovedEvent({
				position: existingEntry.position,
				publicCode: existingEntry.publicCode,
			})
		)
	)
	await broadcastToVolunteers(
		JSON.stringify(
			constructQueueEntryRemovedVolunteerEvent({
				position: existingEntry.position,
				publicCode: existingEntry.publicCode,
				netID: existingEntry.netID,
			})
		)
	)

	return `User with netID ${netID} has left the queue`
})
