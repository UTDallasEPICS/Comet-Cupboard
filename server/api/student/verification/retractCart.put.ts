import { createEvent } from "#server/utils/eventsFactory"

import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	let cart = await prisma.cart.findUnique({
		where: {
			cartID: netID,
		},
	})

	if (!cart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}

	const cartID = cart.cartID

	const pendingCart = await prisma.cart.findUnique({
		where: {
			cartID: cartID,
		},
	})
	if (!pendingCart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `User has no active cart for cartID ${cartID}` })
	}
	if (!pendingCart.pending) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `Cart ${cartID} is not pending verification` })
	}

	cart = await prisma.cart.update({
		where: {
			cartID: cartID,
		},
		data: {
			pending: false,
		},
	})

	if (!cart) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: `Failed to retract cart ${cartID}` })
	}

	await broadcastToVolunteers(JSON.stringify(constructVerifyCartListCartRemovedEvent(cartID)))
	return `Successfully retracted cart ${cartID}`
})
