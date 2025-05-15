import { z } from "zod"
import { messageToUser, broadcastToVolunteers } from "~/server/utils/cartVerificationUtil"
import { broadcastToQueue } from "~/server/utils/queueVerificationUtil"

const schema = z.object({
	cartID: z.string(),
	action: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { cartID, action } = result.data
	if (action != "ACCEPT" && action != "REJECT") {
		throw createError({ statusCode: 400, statusMessage: "Invalid action: Expected ACCEPT or REJECT" })
	}
	const pendingCart = await event.context.prisma.cart.findUnique({
		where: {
			cartID: cartID,
		},
	})
	if (!pendingCart) {
		throw createError({ statusCode: 404, statusMessage: `User has no active cart for cartID ${cartID}` })
	}
	if (!pendingCart.pending) {
		throw createError({ statusCode: 400, statusMessage: `Cart ${cartID} is not pending verification` })
	}

	if (action == "ACCEPT") {
		const transactionResult = await event.context.prisma.$transaction(async (tx) => {
			const cart = await tx.cart.delete({
				where: {
					cartID: cartID,
				},
				include: { CartItems: true },
			})
			const orderItems = cart.CartItems.map((cartItem) => {
				return { itemID: cartItem.itemID, count: cartItem.count }
			})

			orderItems.forEach(async (orderItem) => {
				await tx.item.update({
					where: {
						itemID: orderItem.itemID,
					},
					data: {
						quantity: { decrement: orderItem.count },
					},
				})
			})

			await tx.order.create({
				data: {
					netID: cart.cartID,
					OrderItems: {
						create: orderItems,
					},
				},
			})

			return "Success"
		})
		if (!transactionResult) {
			throw createError({ statusCode: 500, statusMessage: `Failed to accept cart verification for cart ${cartID}` })
		}
		await broadcastToVolunteers(
			JSON.stringify({
				type: "ACCEPT CART",
				payload: pendingCart,
			})
		)
		await messageToUser(
			cartID,
			JSON.stringify({
				type: "ACCEPT CART",
				payload: "Accepted cart",
			})
		)

		await event.context.prisma.queueEntry.delete({
			where: { netID: cartID },
		})

		await broadcastToQueue(
			JSON.stringify({
				type: "QUEUE_DELETE",
				payload: { netID: cartID },
			})
		)

		return `Successfully accepted cart ${cartID}`
	} else if (action == "REJECT") {
		const cart = await event.context.prisma.cart.update({
			where: {
				cartID: cartID,
			},
			data: {
				pending: false,
			},
		})
		if (!cart) {
			throw createError({ statusCode: 500, statusMessage: `Failed to reject cart verification for cart ${cartID}` })
		}
		await broadcastToVolunteers(
			JSON.stringify({
				type: "REJECT CART",
				payload: cart,
			})
		)
		await messageToUser(
			cartID,
			JSON.stringify({
				type: "REJECT CART",
				payload: "Rejected cart",
			})
		)
		return `Successfully rejected cart ${cartID}`
	}
})
