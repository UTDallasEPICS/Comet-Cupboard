import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
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
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Item with id ${itemID} not in cart` })
		}
		return `Successfully deleted item ${itemID} from cart`
	} catch (error) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to delete item from cart" })
	}
})
