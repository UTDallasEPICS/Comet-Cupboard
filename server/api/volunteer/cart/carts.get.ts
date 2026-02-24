import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const carts = await prisma.cart.findMany()
	if (!carts) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find carts" })
	}
	return carts
})
