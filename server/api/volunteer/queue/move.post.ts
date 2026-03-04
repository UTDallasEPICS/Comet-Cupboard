import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	netID: z.string(),
	newPosition: z.number().int().nonnegative(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { netID, newPosition } = result.data

	const entry = await prisma.queueEntry.findUnique({ where: { netID } })
	if (!entry) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Student not in queue" })
	}

	const oldPosition = entry.position

	if (newPosition === oldPosition) {
		return "No change in position"
	}

	await prisma.$transaction(async (tx) => {
		if (newPosition < oldPosition) {
			await tx.queueEntry.updateMany({
				where: {
					position: { gte: newPosition, lt: oldPosition },
				},
				data: { position: { increment: 1 } },
			})
		} else {
			await tx.queueEntry.updateMany({
				where: {
					position: { gt: oldPosition, lte: newPosition },
				},
				data: { position: { decrement: 1 } },
			})
		}

		await tx.queueEntry.update({
			where: { netID },
			data: { position: newPosition },
		})
	})

	const updatedQueue = await prisma.queueEntry.findMany({
		orderBy: { position: "asc" },
		select: {
			position: true,
			publicCode: true,
			netID: true,
		},
	})

	const updatedQueueFiltered = updatedQueue.map((entry) => ({
		position: entry.position,
		publicCode: entry.publicCode,
	}))

	await broadcastToStudents(JSON.stringify(constructQueueUpdatedEvent(updatedQueueFiltered)))
	await broadcastToVolunteers(JSON.stringify(constructQueueUpdatedEvent(updatedQueue)))

	return updatedQueue
})
