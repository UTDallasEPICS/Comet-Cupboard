import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID } = result.data
	if (event.context.user.Cart) {
		const cartItem = await event.context.prisma.cartItem.update({
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
			await event.context.prisma.cartItem.delete({
				where: {
					cartItemID: {
						cartID: event.context.user.Cart.cartID,
						itemID: itemID,
					},
				},
			})
		}
	}
})
