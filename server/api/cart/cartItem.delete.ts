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
	const cartItem = event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)
	const cartItemCount: number = cartItem.count
	const transactionResult = event.context.prisma.$transaction(async (tx) => {
		// update item count
		await tx.item.update({
			where: {
				itemID: itemID,
			},
			data: {
				quantity: { increment: cartItemCount },
			},
		})

		// delete item from cart
		await tx.cartItem.delete({
			where: {
				cartItemID: {
					cartID: event.context.user.Cart.cartID,
					itemID: itemID,
				},
			},
		})
	})
	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: "Failed to delete item from cart" })
	}
	return "Successfully deleted item from cart"
})
