export default defineEventHandler(async (event) => {
	if (event.context.user.Cart) {
		throw createError({ statusCode: 400, statusMessage: `User ${event.context.user.netID} already has an active cart` })
	}
	// create a new cart
	const cart = await event.context.prisma.cart.create({
		data: {
			cartID: event.context.user.netID,
		},
	})
	if (!cart) {
		throw createError({ statusCode: 500, statusMessage: `Failed to create cart for user ${event.context.user.netID}` })
	}
	return `Successfully created cart for user ${event.context.user.netID}`
})
