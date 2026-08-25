import { z } from "zod"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		adjustments: z.array(
			z.object({
				specificItemID: z.string().min(1),
				countAdjustment: z.number().int().max(0),
			})
		),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	const { adjustments } = await validateBody(event, schema)

	const cart = await prisma.$transaction(async (tx) => {
		const existingCart = await tx.cart.findUnique({
			where: { publicCode: publicCode, pending: false },
			include: {
				cartItems: {
					include: {
						specificItem: { include: { item: { include: { deal: true, category: true } } } },
					},
				},
			},
		})

		if (!existingCart) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "User has no non-pending cart" })
		}

		for (const adjustment of adjustments) {
			const cartItem = existingCart.cartItems.find((cartItem) => cartItem.specificItemID === adjustment.specificItemID)
			if (!cartItem) {
				throw createError({
					statusCode: StatusCodes.BAD_REQUEST,
					statusMessage: "Item is not in the cart and cannot be adjusted",
				})
			}
			const adjustedCountOff = adjustment.countAdjustment
			if (Math.abs(adjustedCountOff) > cartItem.count) {
				throw createError({
					statusCode: StatusCodes.BAD_REQUEST,
					statusMessage: "Adjusted count for item exceeds quantity in cart",
				})
			}
			try {
				await tx.cartItem.update({
					where: { cartItemID: { publicCode: publicCode, specificItemID: adjustment.specificItemID } },
					data: {
						countAdjustment: adjustment.countAdjustment,
					},
				})
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart item not found" })
				}
				throw error
			}
		}

		try {
			const updatedCart = await tx.cart.update({
				where: { publicCode: publicCode },
				data: { pending: true },
				include: {
					cartItems: {
						include: {
							specificItem: { include: { item: { include: { deal: true, category: true } } } },
						},
					},
					userSession: {
						select: {
							publicCode: true,
							publicIcon: true,
						},
					},
				},
			})
			return updatedCart
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
			}
			throw error
		}
	})
	const formattedCart = {
		...cart,
		publicCode: cart.publicCode,
		publicIcon: cart.userSession.publicIcon,
	}
	publishEvent(createEvent("verifyCartList.cart.added", { cart: formattedCart }))

	return "Successfully requested cart verification"
})
