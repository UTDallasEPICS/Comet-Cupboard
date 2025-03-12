export default defineEventHandler(async (event) => {
	const pendingCarts = await event.context.prisma.cart.findMany({
		where: {
			pending: true,
		},
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!pendingCarts) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find pending carts" })
	}
	return pendingCarts
})
