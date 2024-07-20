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
	// find item with corresponding itemID
	const item = await event.context.prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
	})
	if (!item) {
		throw createError({ statusCode: 404, statusMessage: "Item does not exist" })
	}
	if (item.quantity <= 0) {
		throw createError({ statusCode: 404, statusMessage: "Item out of stock" })
	}
	const transactionResult = event.context.prisma.$transaction(async (tx) => {
		// update item count
		await tx.item.update({
			where: {
				itemID: itemID,
			},
			data: {
				quantity: { decrement: 1 },
			},
		})

		// create item/add item in cart
		await tx.cartItem.upsert({
			where: {
				cartItemID: {
					cartID: event.context.user.Cart.cartID,
					itemID: itemID,
				},
			},
			update: {
				count: { increment: 1 },
			},
			create: {
				cartID: event.context.user.Cart.cartID,
				itemID: itemID,
				count: 1,
			},
		})
	})
	if(!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: "Failed to add item to cart" })
	}
	return "Successfully added item to cart"
})
