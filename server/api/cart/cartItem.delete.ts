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
	if (event.context.user.Cart) {
		event.context.prisma.$transaction(async (tx) => {
			if (!event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)) {
				throw new Error(`Item not in cart`)
			}

			await tx.item.update({
				where: {
					itemID: itemID,
				},
				data: {
					quantity: { increment: 1 },
				},
			})

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
	}
})
