export default defineEventHandler(async (event) => {
	if (event.context.user.Cart) {
		await event.context.prisma.cart.delete({
			where: {
				cartID: event.context.user.netID,
			},
		})
		return `Successfully deleted cart ${event.context.user.netID}`
	} else {
		throw createError({ statusCode: 404, statusMessage: "Cart not found" })
	}
})
