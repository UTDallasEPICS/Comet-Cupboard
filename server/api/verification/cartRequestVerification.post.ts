import { broadcastToVolunteers } from "~/server/utils/cartVerificationUtil"

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
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!cart) {
		throw createError({ statusCode: 500, statusMessage: "Failed to request cart verification" })
	}
	await broadcastToVolunteers(
		JSON.stringify({
			type: "NEW CART",
			payload: cart,
		})
	)
	return "Successfully requested cart verification"
})
