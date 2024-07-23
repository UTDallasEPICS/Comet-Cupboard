export default defineEventHandler(async (event) => {
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: "User has no active cart" })
	}
	if (event.context.user.Cart.pending) {
		return "Cart is already pending verification"
	}
    // set cart status to pending
	const cart = await event.context.prisma.cart.update({
		where: {
			cartID: event.context.user.netID,
		},
		data: {
			pending: true,
		},
	})
	if (!cart) {
		throw createError({ statusCode: 500, statusMessage: "Failed to request cart verification" })
	}
	return "Successfully requested cart verification"
})
