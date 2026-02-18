import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

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
	const netID = event.context.user.netID

	if (incrementChange === 0) {
		return "No changes made"
	}

	const transactionResult = await prisma.$transaction(async (tx) => {
		const cart = await tx.cart.findUnique({
			where: { cartID: netID },
			select: { cartID: true, pending: true },
		})

		if (!cart) {
			throw createError({ statusCode: 404, statusMessage: `Cart not found for user ${netID}` })
		}

		if (cart.pending) {
			throw createError({
				statusCode: 409,
				statusMessage: `Cart is pending verification`,
			})
		}

		if (incrementChange > 0) {
			const cartItem = await tx.cartItem.upsert({
				where: { cartItemID: { cartID: cart.cartID, itemID } },
				update: { count: { increment: incrementChange } },
				create: { cartID: cart.cartID, itemID, count: incrementChange },
			})

			return cartItem
		} else {
			const updated = await tx.cartItem.updateMany({
				where: { cartID: cart.cartID, itemID },
				data: { count: { increment: incrementChange } },
			})

			if (updated.count === 0) {
				throw createError({ statusCode: 404, statusMessage: `Item not in cart` })
			}
			// Remove items with count <= 0
			await tx.cartItem.deleteMany({
				where: { cartID: cart.cartID, itemID, count: { lte: 0 } },
			})
			return tx.cartItem.findUnique({
				where: { cartItemID: { cartID: cart.cartID, itemID } },
			})
		}
	})

	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: `Failed to edit item with id ${itemID} from cart` })
	}

	return `Successfully edited cartItem ${JSON.stringify(transactionResult)}`
})
