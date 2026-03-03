import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	cartID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request parameters" })
	}
	const { cartID } = queries.data
	const pendingCart = await prisma.cart.findUnique({
		where: {
			cartID: cartID,
			pending: true,
		},
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!pendingCart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Failed to find pending cart with cartID ${cartID}` })
	}
	return pendingCart
})
