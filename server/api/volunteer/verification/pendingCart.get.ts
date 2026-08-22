import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		publicCode: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { publicCode } = validateQuery(event, schema)

	const pendingCart = await prisma.cart.findUnique({
		where: {
			publicCode: publicCode,
			pending: true,
		},
		include: {
			cartItems: { include: { specificItem: { include: { item: { include: { deal: true } } } } } },
			userSession: { select: { publicIcon: true } },
		},
	})
	if (!pendingCart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Failed to find pending cart" })
	}

	const formattedPendingCart = {
		...pendingCart,
		userSession: undefined,
		publicIcon: pendingCart.userSession.publicIcon,
	}

	return formattedPendingCart
})
