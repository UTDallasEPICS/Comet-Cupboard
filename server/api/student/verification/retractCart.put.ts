import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { Prisma } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	const cart = await prisma.$transaction(async (tx) => {
		const pendingCart = await tx.cart.findUnique({
			where: {
				publicCode: publicCode,
				pending: true,
			},
		})
		if (!pendingCart) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User has no pending cart" })
		}

		try {
			const cart = await tx.cart.update({
				where: {
					publicCode: publicCode,
				},
				data: {
					pending: false,
				},
			})
			return cart
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
			}
			throw error
		}
	})

	publishEvent(createEvent("verifyCartList.cart.removed", { publicCode: cart.publicCode }))
	return "Successfully retracted cart"
})
