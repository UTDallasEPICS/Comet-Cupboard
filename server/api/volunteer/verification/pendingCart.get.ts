import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		cartID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { cartID } = validateQuery(event, schema)

	const pendingCart = await prisma.cart.findUnique({
		where: {
			cartID: cartID,
			pending: true,
		},
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!pendingCart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Failed to find pending cart" })
	}
	return pendingCart
})
