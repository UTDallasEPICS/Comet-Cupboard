import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID
	try {
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
			setResponseStatus(event, StatusCodes.NO_CONTENT)
			return
		}

		return cart
	} catch (error) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Unable to retrieve cart" })
	}
})
