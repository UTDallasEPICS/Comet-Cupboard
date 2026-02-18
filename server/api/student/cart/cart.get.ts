import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
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
			setResponseStatus(event, 204)
			return
		}

		return cart
	} catch (error) {
		throw createError({ statusCode: 500, statusMessage: "Unable to retrieve cart" })
	}
})
