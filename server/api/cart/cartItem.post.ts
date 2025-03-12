import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
	incrementChange: z.number().int().min(-1).max(1),
	count: z.number().int().nonnegative(),
	expiredCount: z.number().int().nonnegative(),
})

const validateSchema = schema.strict().partial().required({
	itemID: true,
	incrementChange: true,
})

/*
	Two ways to use POST cartItem: Incremental or Edit
	For incremental:
		Assign the amount you want to increment/decrement by in incrementChange field
			ex. 1 or -1
	For edit:
		Assign incrementChange = 0
		Assign values to count or expiredCount. Not assigning the field will not update the field. 
*/

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, incrementChange, count, expiredCount } = result.data
	if (!event.context.user.Cart) {
		throw createError({ statusCode: 404, statusMessage: `User ${event.context.user.netID} has no active cart` })
	}
	if (event.context.user.Cart.pending) {
		throw createError({ statusCode: 400, statusMessage: `User ${event.context.user.netID} cart is pending verification` })
	}
	if (
		(incrementChange < 0 || count != undefined || expiredCount != undefined) &&
		!event.context.user.Cart.CartItems.find((cartItem) => cartItem.itemID == itemID)
	) {
		throw createError({ statusCode: 404, statusMessage: `Item with id ${itemID} not in cart` })
	}
	if (incrementChange == 0 && count == undefined && expiredCount == undefined) {
		return "No changes made"
	}
	const transactionResult = await event.context.prisma.$transaction(async (tx) => {
		let cartItem

		if (incrementChange != 0) {
			cartItem = await tx.cartItem.upsert({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
				update: {
					count: { increment: incrementChange },
				},
				// create is only ever ran when incrementChange > 0
				create: {
					cartID: event.context.user.Cart.cartID,
					itemID: itemID,
					count: incrementChange,
					expiredCount: 0,
				},
			})
		} else {
			cartItem = await tx.cartItem.update({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
				data: {
					count: count,
					expiredCount: expiredCount,
				},
			})
		}

		let cartItemFinal

		// delete item from cart if needed
		if (cartItem.count <= 0) {
			cartItemFinal = await tx.cartItem.delete({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
			})
		}
		// ensure expiredCount <= count
		else if (cartItem.expiredCount > cartItem.count) {
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
		return cartItemFinal ? cartItemFinal : cartItem
	})
	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: `Failed to edit item with id ${itemID} from cart` })
	}
	return `Successfully edited cartItem ${JSON.stringify(transactionResult)}`
})
