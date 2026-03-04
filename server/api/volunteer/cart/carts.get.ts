import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

export default defineEventHandler(async (event) => {
	const carts = await prisma.cart.findMany()
	if (!carts) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to find carts" })
	}
	return carts
})
