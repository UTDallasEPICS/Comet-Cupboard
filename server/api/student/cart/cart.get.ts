import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const cart = await prisma.cart.findUnique({
		where: {
			cartID: netID,
		},
		include: {
			CartItems: {
				include: {
					Item: {
						omit: { quantity: true },
						include: {
							Deal: true,
						},
					},
				},
			},
		},
	})

	if (!cart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User does not have a cart" })
	}

	return cart
})
