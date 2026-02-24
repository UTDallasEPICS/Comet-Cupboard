import { z } from "zod"
import { broadcastToVolunteers } from "#server/utils/volunteerStreamUtil"
import { constructVerifyCartListCartAddedEvent } from "#server/utils/eventsUtil"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	adjustments: z.array(
		z.object({
			itemID: z.string().min(1),
			countAdjustment: z.number().int().min(0),
		})
	),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}

	const { adjustments } = result.data

	try {
		const cart = await prisma.$transaction(async (tx) => {
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

			for (const adjustment of adjustments) {
				const cartItem = existingCart.CartItems.find((cartItem) => cartItem.itemID === adjustment.itemID)
				if (!cartItem) {
					throw createError({
						statusCode: 400,
						statusMessage: `Item ${adjustment.itemID} is not in the cart and cannot be adjusted`,
					})
				}
				const adjustedCountOff = adjustment.countAdjustment
				if (adjustedCountOff > cartItem.count) {
					throw createError({
						statusCode: 400,
						statusMessage: `Adjusted count for item ${adjustment.itemID} exceeds quantity in cart`,
					})
				}
				await tx.cartItem.update({
					where: { cartItemID: { cartID: netID, itemID: adjustment.itemID } },
					data: {
						countAdjustment: adjustment.countAdjustment,
					},
				})
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
