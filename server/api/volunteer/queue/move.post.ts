import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		netID: z.string(),
		newPosition: z.number().int().nonnegative(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { netID, newPosition } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const entry = await tx.queueEntry.findUnique({ where: { netID } })
		if (!entry) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Student not in queue" })
		}

		const oldPosition = entry.position

		if (newPosition === oldPosition) {
			return "No change in position"
		}

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

		const updatedQueue = await tx.queueEntry.findMany({
			orderBy: { position: "asc" },
			select: {
				position: true,
				publicCode: true,
				netID: true,
			},
		})

		publishEvent(createEvent("queue.queueUpdated", updatedQueue))

		return "Queue entry position has been updated"
	})

	return transactionResult
})
