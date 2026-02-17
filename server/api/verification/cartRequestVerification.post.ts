import { broadcastToVolunteers } from "#server/utils/volunteerStreamUtil"
import { constructVerifyCartListCartAddedEvent } from "#server/utils/eventsUtil"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	try {
		const cart = await event.context.prisma.$transaction(async (tx) => {
			const existingCart = await tx.cart.findUnique({
				where: { cartID: netID },
				include: {
					CartItems: {
						include: {
							Item: {
								omit: { quantity: true },
								include: { Deal: true },
							},
						},
					},
				},
			})

			if (!existingCart) {
				throw createError({ statusCode: 404, statusMessage: `User ${netID} has no active cart` })
			}

			if (existingCart.pending) {
				throw createError({ statusCode: 400, statusMessage: `Cart ${netID} is already pending verification` })
			}

			const updatedCart = await tx.cart.update({
				where: { cartID: netID },
				data: { pending: true },
				include: {
					CartItems: {
						include: {
							Item: {
								omit: { quantity: true },
								include: { Deal: true },
							},
						},
					},
				},
			})

			return updatedCart
		})

		await broadcastToVolunteers(JSON.stringify(constructVerifyCartListCartAddedEvent(cart)))
		return `Successfully requested cart verification for user ${netID}`
	} catch (error: any) {
		throw createError({
			statusCode: error?.statusCode || 500,
			statusMessage: error?.statusMessage || "Failed to request cart verification",
		})
	}
})
