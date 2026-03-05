import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		cartID: z.string(),
		action: z.enum(["ACCEPT", "REJECT"]),
		reason: z.string().optional(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { cartID, action, reason } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const pendingCart = await prisma.cart.findUnique({
			where: { cartID: cartID, pending: true },
			include: { CartItems: true },
		})

		if (!pendingCart) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User has no active pending cart" })
		}

		if (action === "ACCEPT") {
			const orderItems = pendingCart.CartItems.map((cartItem) => ({
				itemID: cartItem.itemID,
				count: cartItem.count,
			}))

			for (const orderItem of orderItems) {
				await tx.item.update({
					where: { itemID: orderItem.itemID },
					data: { quantity: { decrement: orderItem.count } },
				})
			}

			await tx.order.create({
				data: {
					netID: pendingCart.cartID,
					OrderItems: { create: orderItems },
				},
			})

			await tx.cart.delete({ where: { cartID } })

			publishEvent(createEvent("cart.verification.decision", { decision: "ACCEPT", reason }))
			publishEvent(createEvent("cartSession.removed", { cartID }))
			publishEvent(createEvent("verifyCartList.cart.removed", { cartID }))

			return "Successfully accepted cart"
		} else {
			await tx.cart.update({
				where: { cartID },
				data: { pending: false },
			})

			publishEvent(createEvent("cart.verification.decision", { decision: "REJECT", reason }))
			publishEvent(createEvent("verifyCartList.cart.removed", { cartID }))

			return "Successfully rejected cart"
		}
	})

	return transactionResult
})
