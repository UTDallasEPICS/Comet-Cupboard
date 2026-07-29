import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	const cart = await prisma.cart.findUnique({
		where: {
			publicCode: publicCode,
		},
		include: {
			CartItems: {
				include: {
					Item: {
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
