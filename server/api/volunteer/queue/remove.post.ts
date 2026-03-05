import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	netID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { netID } = result.data

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
	return `User with netID ${netID} has been removed from the queue`
})
