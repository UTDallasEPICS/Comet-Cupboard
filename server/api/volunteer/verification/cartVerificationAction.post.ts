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
			include: { cartItems: true, userSession: { select: { userID: true } } },
		})

		if (!pendingCart) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User has no active pending cart" })
		}

		if (action === "ACCEPT") {
			const cartItems = await Promise.all(
				pendingCart.cartItems.map(async (cartItem) => {
					const specificItem = await tx.specificItem.findUnique({
						where: { specificItemID: cartItem.specificItemID },
					})
					if (!specificItem) {
						throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Specific item not found" })
					}

					return { specificItem, finalCount: cartItem.count + cartItem.countAdjustment }
				})
			)
			const orderItems = cartItems.filter(({ finalCount }) => finalCount > 0).map(({ specificItem, finalCount }) => ({
				specificItemID: specificItem.specificItemID,
				count: finalCount,
			}))

			for (const { specificItem, finalCount } of cartItems) {
				if (Number(specificItem.quantity) < finalCount) {
					throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Insufficient inventory to accept cart" })
				}
				await tx.specificItem.update({
					where: { specificItemID: specificItem.specificItemID },
					data: { quantity: specificItem.quantity - finalCount },
				})
			}

			if (orderItems.length) {
				await tx.order.create({
					data: {
						userID: pendingCart.userSession.userID,
						orderItems: { create: orderItems },
						cartCreatedAt: pendingCart.createdAt,
					},
				})
			}
			await tx.auditLog.create({
				data: {
					action: "VERIFY_CART_APPROVED",
					message: `Cart ${publicCode} approved${reason ? `: ${reason}` : ""}`,
					userID: event.context.userSession.userID,
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

			publishEvent(
				createEvent("cart.verification.decision", { publicCode: publicCode, decision: "ACCEPT", reason, userID: pendingCart.userSession.userID })
			)
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

			await tx.auditLog.create({
				data: {
					action: "VERIFY_CART_REJECTED",
					message: `Cart ${publicCode} rejected${reason ? `: ${reason}` : ""}`,
					userID: event.context.userSession.userID,
				},
			})

			publishEvent(
				createEvent("cart.verification.decision", { publicCode: publicCode, decision: "REJECT", reason, userID: pendingCart.userSession.userID })
			)
			publishEvent(createEvent("verifyCartList.cart.removed", { publicCode }))

			return "Successfully rejected cart"
		}
	})

	return transactionResult
})
