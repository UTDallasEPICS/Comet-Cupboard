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
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}
	if (event.context.user.Cart.pending) {
		throw createError({ statusCode: 400, statusMessage: `User ${event.context.user.netID} cart is pending verification` })
	}
	if (!event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)) {
		throw createError({ statusCode: 404, statusMessage: `Item with id ${itemID} not in cart` })
	}
	const cartItem = await event.context.prisma.cartItem.delete({
		where: {
			cartItemID: {
				cartID: event.context.user.Cart.cartID,
				itemID: itemID,
			},
		},
	})
	if (!cartItem) {
		throw createError({ statusCode: 500, statusMessage: `Failed to delete item with id ${itemID} from cart` })
	}
	return `Successfully deleted item with id ${itemID} from cart`
})
