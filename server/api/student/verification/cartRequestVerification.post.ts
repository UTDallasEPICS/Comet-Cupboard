import { z } from "zod"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		adjustments: z.array(
			z.object({
				itemID: z.string().min(1),
				countAdjustment: z.number().int().min(0),
			})
		),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const { adjustments } = await validateBody(event, schema)

	const cart = await prisma.$transaction(async (tx) => {
		const existingCart = await tx.cart.findUnique({
			where: { cartID: netID, pending: false },
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
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User has active non-pending cart" })
		}

		for (const adjustment of adjustments) {
			const cartItem = existingCart.CartItems.find((cartItem) => cartItem.itemID === adjustment.itemID)
			if (!cartItem) {
				throw createError({
					statusCode: StatusCodes.BAD_REQUEST,
					statusMessage: "Item is not in the cart and cannot be adjusted",
				})
			}
			const adjustedCountOff = adjustment.countAdjustment
			if (adjustedCountOff > cartItem.count) {
				throw createError({
					statusCode: StatusCodes.BAD_REQUEST,
					statusMessage: "Adjusted count for item exceeds quantity in cart",
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
	publishEvent(createEvent("verifyCartList.cart.added", { cart: cart }))

	return "Successfully requested cart verification"
})
