import { z } from "zod"
import { broadcastToVolunteers } from "#server/utils/volunteerStreamUtil"
import { constructVerifyCartListCartAddedEvent } from "~~/server/utils/eventsFactory"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

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
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
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
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `User ${netID} has no active cart` })
			}

			if (existingCart.pending) {
				throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `Cart ${netID} is already pending verification` })
			}

			for (const adjustment of adjustments) {
				const cartItem = existingCart.CartItems.find((cartItem) => cartItem.itemID === adjustment.itemID)
				if (!cartItem) {
					throw createError({
						statusCode: StatusCodes.BAD_REQUEST,
						statusMessage: `Item ${adjustment.itemID} is not in the cart and cannot be adjusted`,
					})
				}
				const adjustedCountOff = adjustment.countAdjustment
				if (adjustedCountOff > cartItem.count) {
					throw createError({
						statusCode: StatusCodes.BAD_REQUEST,
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
			statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
			statusMessage: error?.statusMessage || "Failed to request cart verification",
		})
	}
})
