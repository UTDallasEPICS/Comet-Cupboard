import { z } from "zod"
import { prisma } from "#server/utils/db"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		publicCode: z.string(),
		action: z.enum(["ACCEPT", "REJECT"]),
		reason: z.string().optional(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { publicCode, action, reason } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const pendingCart = await tx.cart.findUnique({
			where: { publicCode: publicCode, pending: true },
			include: { CartItems: true, UserSession: { select: { userID: true } } },
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
				try {
					await tx.item.update({
						where: { itemID: orderItem.itemID },
						data: { quantity: { decrement: orderItem.count } },
					})
				} catch (error: unknown) {
					if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
						throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
					}
					throw error
				}
			}

			await tx.order.create({
				data: {
					userID: pendingCart.UserSession.userID,
					OrderItems: { create: orderItems },
					cartCreatedAt: pendingCart.createdAt,
				},
			})

			try {
				await tx.cart.delete({ where: { publicCode } })
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
				}
				throw error
			}

			publishEvent(createEvent("cart.verification.decision", { publicCode: publicCode, decision: "ACCEPT", reason, userID: pendingCart.UserSession.userID }))
			publishEvent(createEvent("cartSession.removed", { publicCode }))
			publishEvent(createEvent("verifyCartList.cart.removed", { publicCode }))

			return "Successfully accepted cart"
		} else {
			try {
				await tx.cart.update({
					where: { publicCode },
					data: { pending: false },
				})
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
				}
				throw error
			}

			publishEvent(createEvent("cart.verification.decision", { publicCode: publicCode, decision: "REJECT", reason, userID: pendingCart.UserSession.userID }))
			publishEvent(createEvent("verifyCartList.cart.removed", { publicCode }))

			return "Successfully rejected cart"
		}
	})

	return transactionResult
})
