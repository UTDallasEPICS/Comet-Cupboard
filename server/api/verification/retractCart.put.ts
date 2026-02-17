import { constructVerifyCartListCartRemovedEvent } from "~~/server/utils/eventsUtil"
import { broadcastToVolunteers } from "~~/server/utils/volunteerStreamUtil"
import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	let cart = await prisma.cart.findUnique({
		where: {
			cartID: netID,
		},
	})

	if (!cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}

	const cartID = cart.cartID

	const pendingCart = await prisma.cart.findUnique({
		where: {
			cartID: cartID,
		},
	})
	if (!pendingCart) {
		throw createError({ statusCode: 404, statusMessage: `User has no active cart for cartID ${cartID}` })
	}
	if (!pendingCart.pending) {
		throw createError({ statusCode: 400, statusMessage: `Cart ${cartID} is not pending verification` })
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
		throw createError({ statusCode: 500, statusMessage: `Failed to retract cart ${cartID}` })
	}

	await broadcastToVolunteers(JSON.stringify(constructVerifyCartListCartRemovedEvent(cartID)))
	return `Successfully retracted cart ${cartID}`
})
