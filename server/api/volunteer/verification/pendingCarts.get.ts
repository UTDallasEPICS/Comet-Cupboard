import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

export default defineEventHandler(async (event) => {
	const pendingCarts = await prisma.cart.findMany({
		where: {
			pending: true,
		},
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!pendingCarts) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Failed to find pending carts" })
	}
	return pendingCarts
})
