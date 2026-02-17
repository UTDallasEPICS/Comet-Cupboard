import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	// testing for now
	const netID = event.context.user.netID
	const newCart = await prisma.cart.create({
		data: {
			cartID: netID,
		},
	})
	if (!newCart) {
		throw createError({ statusCode: 500, statusMessage: "Failed to create cart" })
	}
	return `Successfully created cart for user ${netID}`
})
