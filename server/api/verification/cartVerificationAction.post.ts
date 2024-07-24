import { z } from "zod"
import { nanoid } from "nanoid"
import { messageToUser, broadcastToVolunteers } from "~/server/utils/cartVerificationUtil"

const schema = z.object({
	cartID: z.string(),
	action: z.string(),
	reason: z.string().default("No reason provided"),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { cartID, action, reason } = result.data
	if (action != "ACCEPT" && action != "REJECT") {
		throw createError({ statusCode: 400, statusMessage: "Invalid action" })
	}
	const pendingCart = await event.context.prisma.cart.findUnique({
		where: {
			cartID: cartID,
		},
	})
	if (!pendingCart) {
		throw createError({ statusCode: 404, statusMessage: "User has no active cart" })
	}
	if (!pendingCart.pending) {
		throw createError({ statusCode: 400, statusMessage: "Cart is not pending verification" })
	}

	if (action == "ACCEPT") {
		const transactionResult = event.context.prisma.$transaction(async (tx) => {
			const cart = await tx.cart.delete({
				where: {
					cartID: cartID,
				},
				include: { CartItems: true }
			})
			const orderItems = cart.CartItems.map((cartItem) => {
				return { itemID: cartItem.itemID, count: cartItem.count }
			})
			await tx.order.create({
				data: {
					orderID: nanoid(),
					netID: cart.cartID,
					date: new Date(),
					acceptReason: reason,
					OrderItems: {
						create: orderItems,
					},
				},
			})
		})
		if (!transactionResult) {
			throw createError({ statusCode: 500, statusMessage: "Failed to accept cart verification" })
		}
		await broadcastToVolunteers(`ACCEPTED ${JSON.stringify(pendingCart)}`)
		await messageToUser(cartID, `Cart accepted with reason ${reason}`)
		return `Successfully accepted cart with reason ${reason}`
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
			throw createError({ statusCode: 500, statusMessage: "Failed to reject cart verification" })
		}
		await broadcastToVolunteers(`REJECTED ${JSON.stringify(cart)}`)
		await messageToUser(cartID, `Cart rejected with reason ${reason}`)
		return `Successfully rejected cart with reason ${reason}`
	}
})
