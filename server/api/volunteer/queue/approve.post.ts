import { z } from "zod"
import { prisma } from "#server/utils/db"
import { constructCartSessionCreatedEvent, constructQueueEntryApprovedEvent, constructQueueEntryApprovedVolunteerEvent } from "#server/utils/eventsFactory"
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
	const transaction = await prisma.$transaction(async (tx) => {
		await tx.queueEntry.delete({
			where: { netID },
		})
		// await tx.queueEntry.updateMany({
		//     where: {
		//         position: {
		//             gt: existingEntry.position,
		//         },
		//     },
		//     data: {
		//         position: {
		//             decrement: 1,
		//         },
		//     },
		// })
		await tx.cart.create({
			data: {
				cartID: netID,
			},
		})

		await broadcastToStudents(
			JSON.stringify(
				constructQueueEntryApprovedEvent({
					position: existingEntry.position,
					publicCode: existingEntry.publicCode,
				})
			)
		)
		await broadcastToVolunteers(
			JSON.stringify(
				constructQueueEntryApprovedVolunteerEvent({
					position: existingEntry.position,
					publicCode: existingEntry.publicCode,
					netID: existingEntry.netID,
				})
			)
		)
		await broadcastToVolunteers(JSON.stringify(constructCartSessionCreatedEvent(existingEntry.netID)))
		return `User with netID ${netID} has been approved and moved to a cart`
	})
	return transaction
})
