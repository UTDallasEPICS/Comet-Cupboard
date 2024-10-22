import { z } from "zod"

const schema = z.object({
	cartID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { cartID } = queries.data
	const pendingCart = await event.context.prisma.cart.findUnique({
		where: {
			cartID: cartID,
			pending: true,
		},
		include: { CartItems: { include: { Item: { include: { Deal: true } } } } },
	})
	if (!pendingCart) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find pending cart" })
	}
	return pendingCart
})
