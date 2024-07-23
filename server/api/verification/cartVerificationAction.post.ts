import { z } from "zod"

const schema = z.object({
	cartID: z.string(),
	action: z.string(),
	reason: z.string(),
})

const validateSchema = schema.strict().partial().required({
	cartID: true,
	action: true,
})

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { cartID, action, reason } = result.data
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
			const cart = tx.cart.delete({
				where: {
					cartID: cartID,
				},
			})
		})
		if (!transactionResult) {
			throw createError({ statusCode: 500, statusMessage: "Failed to accept cart verification" })
		}
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
		return `Successfully rejected cart with reason ${reason}`
	}
})
