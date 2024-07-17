export default defineEventHandler(async (event) => {
    if (event.context.user.Cart) {
		return event.context.user.Cart
	}
})
