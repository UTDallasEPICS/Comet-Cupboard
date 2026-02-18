import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

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

	const netID = event.context.user.netID
	try {
		const result = await prisma.cartItem.deleteMany({
			where: {
				cartID: netID,
				Cart: {
					pending: false,
				},
				itemID: itemID,
			},
		})
		if (result.count == 0) {
			throw createError({ statusCode: 404, statusMessage: `Item with id ${itemID} not in cart` })
		}
		return `Successfully deleted item ${itemID} from cart`
	} catch (error) {
		throw createError({ statusCode: 500, statusMessage: "Failed to delete item from cart" })
	}
})
