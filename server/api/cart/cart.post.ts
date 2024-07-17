export default defineEventHandler(async (event) => {
	if (!event.context.user.Cart) {
		await event.context.prisma.cart.create({
			data: {
				cartID: event.context.user.netID,
				date: new Date(),
			},
		})
	}
})
