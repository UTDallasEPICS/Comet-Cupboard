import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request parameters" })
	}
	const { itemID } = queries.data
	// find item with corresponding itemID
	const item = await prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
		include: {
			Deal: true,
		},
	})
	if (!item) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
	}
	return item
})
