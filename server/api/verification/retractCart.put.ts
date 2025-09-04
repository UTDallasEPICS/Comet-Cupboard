export default defineEventHandler(async (event) => {
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}

	const cartID = event.context.user.Cart.cartID

	const pendingCart = await event.context.prisma.cart.findUnique({
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

	const cart = await event.context.prisma.cart.update({
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

	await broadcastToVolunteers(
		JSON.stringify({
			type: "RETRACT CART",
			payload: pendingCart,
		})
	)
	await messageToUser(
		cartID,
		JSON.stringify({
			type: "RETRACT CART",
			payload: "Retracted cart",
		})
	)

	return `Successfully rejected cart ${cartID}`
})
