import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
	incrementChange: z.number().int().min(-1).max(1),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, incrementChange } = result.data
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}
	if (event.context.user.Cart.pending) {
		throw createError({ statusCode: 400, statusMessage: `User ${event.context.user.netID} cart is pending verification` })
	}
	if (incrementChange < 0 && !event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)) {
		throw createError({ statusCode: 404, statusMessage: `Item with id ${itemID} not in cart` })
	}
	if (incrementChange == 0) {
		return "No changes made"
	}
	const transactionResult = await event.context.prisma.$transaction(async (tx) => {
		const cartItem = await tx.cartItem.update({
			where: {
				cartItemID: {
					cartID: event.context.user.Cart.cartID,
					itemID: itemID,
				},
			},
			data: {
				expiredCount: { increment: incrementChange },
			},
		})

		let cartItemFinal
		if (cartItem.expiredCount > cartItem.count) {
			cartItemFinal = await tx.cartItem.update({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
				data: {
					expiredCount: cartItem.count,
				},
			})
		}
		return cartItemFinal
	})
	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: `Failed to edit item with id ${itemID} from cart` })
	}
	return `Successfully edited cartItem ${JSON.stringify(transactionResult)}`
})
