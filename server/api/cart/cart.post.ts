export default defineEventHandler(async (event) => {
	if (event.context.user.Cart) {
		throw createError({ statusCode: 400, statusMessage: "User already has an active cart" })
	}
	// create a new cart
	const cart = await event.context.prisma.cart.create({
		data: {
			cartID: event.context.user.netID,
			date: new Date(),
		},
	})
	if (!cart) {
		throw createError({ statusCode: 500, statusMessage: "Failed to create cart" })
	}
	return "Successfully created cart"
})
