import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		netID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const result = await validateBody(event, schema)
	const { netID } = result

	const transactionResult = await prisma.$transaction(async (tx) => {
		try {
			const queueEntry = await tx.queueEntry.delete({
				where: { netID },
			})
			await tx.cart.create({
				data: {
					cartID: netID,
				},
			})

			publishEvent(createEvent("cartSession.created", { cartID: netID }))
			publishEvent(
				createEvent("queue.entryApproved", {
					netID: netID,
					position: queueEntry.position,
					publicCode: queueEntry.publicCode,
				})
			)

			return "User has been approved and moved to a cart session"
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Queue entry not found" })
			}
			throw error
		}
	})
	return transactionResult
})
