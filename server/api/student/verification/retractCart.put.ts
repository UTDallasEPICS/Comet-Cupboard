import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const cart = await prisma.$transaction(async (tx) => {
		const pendingCart = await tx.cart.findUnique({
			where: {
				cartID: netID,
				pending: true,
			},
		})
		if (!pendingCart) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User has no pending cart" })
		}

		const cart = await tx.cart.update({
			where: {
				cartID: pendingCart.cartID,
			},
			data: {
				pending: false,
			},
		})

		return cart
	})

	publishEvent(createEvent("verifyCartList.cart.removed", { cartID: cart.cartID }))
	return "Successfully retracted cart"
})
