import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	itemID: z.string(),
	actualCount: z.number().int().positive(),
	adjustedCount: z.number().int().nonnegative(),
})

const validateSchema = schema.strict().required()

/*
	NOTE: Consider 1 for 0 deal as FREE
*/

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { itemID, actualCount, adjustedCount } = result.data

	if (actualCount <= adjustedCount) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "adjustedCount must be less than actualCount" })
	}

	const item = await prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
	})

	if (!item) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Item with id ${itemID} does not exist` })
	}

	const deal = await prisma.deal.upsert({
		where: {
			itemID: itemID,
		},
		update: {
			actualCount: actualCount,
			adjustedCount: adjustedCount,
		},
		create: {
			itemID: itemID,
			actualCount: actualCount,
			adjustedCount: adjustedCount,
		},
	})

	if (!deal) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: `Failed to edit deal for item with id ${itemID}` })
	}
	return `Successfully edited deal: ${JSON.stringify(deal)}`
})
