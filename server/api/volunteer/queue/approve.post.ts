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
		publicCode: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const result = await validateBody(event, schema)
	const { publicCode } = result

	const transactionResult = await prisma.$transaction(async (tx) => {
		try {
			const queueEntry = await tx.queueEntry.delete({
				where: { publicCode },
				include: {
					userSession: {
						select: {
							publicCode: true,
							publicIcon: true,
						},
					},
				},
			})
			await tx.cart.create({
				data: {
					publicCode: publicCode,
				},
			})

			publishEvent(createEvent("cartSession.created", { publicCode: publicCode, publicIcon: queueEntry.userSession.publicIcon }))
			publishEvent(
				createEvent("queue.entryApproved", {
					publicCode: publicCode,
					position: queueEntry.position,
					publicIcon: queueEntry.userSession.publicIcon,
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
