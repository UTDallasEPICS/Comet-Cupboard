import { z } from "zod"
import { broadcastToVolunteers } from "#server/utils/volunteerStreamUtil"
import { prisma } from "#server/utils/db"
import { constructCartSessionRemovedEvent } from "#server/utils/eventsFactory"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	cartID: z.string(),
	action: z.enum(["ACCEPT", "REJECT"]),
	reason: z.string().optional(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}

	const { cartID, action, reason } = result.data

	const pendingCart = await prisma.cart.findUnique({
		where: { cartID },
	})

	if (!pendingCart) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `User has no active cart for cartID ${cartID}` })
	}

	if (!pendingCart.pending) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `Cart ${cartID} is not pending verification` })
	}

	if (action === "ACCEPT") {
		// ACCEPT action
		const cart = await prisma.$transaction(async (tx) => {
			const existingCart = await tx.cart.findUnique({
				where: { cartID },
				include: { CartItems: true },
			})

			const orderItems = existingCart.CartItems.map((cartItem) => ({
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
					netID: existingCart.cartID,
					OrderItems: { create: orderItems },
				},
			})

			await tx.cart.delete({ where: { cartID } })
		})

		await broadcastToVolunteers(JSON.stringify(constructVerifyCartListCartRemovedEvent(cartID)))
		await messageToStudent(cartID, JSON.stringify(constructPendingVerificationAcceptedEvent(reason || "")))
		await broadcastToVolunteers(JSON.stringify(constructCartSessionRemovedEvent(cartID)))
		// await prisma.queueEntry.delete({ where: { netID: cartID } })
		// await broadcastToQueue(JSON.stringify({ type: "QUEUE_DELETE", payload: { netID: cartID } }))

		return `Successfully accepted cart ${cartID}`
	} else {
		// REJECT action
		const cart = await prisma.cart.update({
			where: { cartID },
			data: { pending: false },
		})

		await broadcastToVolunteers(JSON.stringify(constructVerifyCartListCartRemovedEvent(cartID)))
		await messageToStudent(cartID, JSON.stringify(constructPendingVerificationRejectedEvent(reason || "")))

		return `Successfully rejected cart ${cartID}`
	}
})
