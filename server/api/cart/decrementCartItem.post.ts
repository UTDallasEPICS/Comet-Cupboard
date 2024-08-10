import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID } = result.data
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: "User has no active cart" })
	}
	if (!event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)) {
		throw createError({ statusCode: 404, statusMessage: "Item not in cart" })
	}
	const transactionResult = event.context.prisma.$transaction(async (tx) => {
		// update item count
		await tx.item.update({
			where: {
				itemID: itemID,
			},
			data: {
				quantity: { increment: 1 },
			},
		})

		// update cart item count
		const cartItem = await tx.cartItem.update({
			where: {
				cartItemID: {
					cartID: event.context.user.Cart.cartID,
					itemID: itemID,
				},
			},
			data: {
				count: { decrement: 1 },
			},
		})

		// delete item from cart if needed
		if (cartItem.count == 0) {
			await tx.cartItem.delete({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
			})
		}
	})
	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: "Failed to decrement item from cart" })
	}
	return "Successfully decremented item from cart"
})
