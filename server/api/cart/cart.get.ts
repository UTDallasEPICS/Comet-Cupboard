export default defineEventHandler(async (event) => {
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}
	return event.context.user.Cart
})
