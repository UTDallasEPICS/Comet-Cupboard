export default defineEventHandler(async (event) => {
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}
	if (event.context.user.Cart.pending) {
		return `User ${event.context.user.netID} cart is already pending verification`
	}
	// set cart status to pending
	const cart = await event.context.prisma.cart.update({
		where: {
			cartID: event.context.user.netID,
		},
		data: {
			pending: true,
		},
		include: { CartItems: { include: { Item: { omit: { quantity: true }, include: { Deal: true } } } } },
	})
	if (!cart) {
		throw createError({ statusCode: 500, statusMessage: `Failed to request cart verification for user ${event.context.user.netID}` })
	}
	await broadcastToVolunteers(
		JSON.stringify({
			type: "NEW CART",
			payload: cart,
		})
	)
	return `Successfully requested cart verification: ${JSON.stringify(cart)}`
})
