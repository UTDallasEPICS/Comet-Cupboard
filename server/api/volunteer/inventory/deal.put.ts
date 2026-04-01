import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
		actualCount: z.number().int().positive(),
		adjustedCount: z.number().int().nonnegative(),
	})
	.refine((data) => data.actualCount > data.adjustedCount, {
		error: "adjustedCount must be less than actualCount",
	})
	.strict()
	.required()

/*
	NOTE: Consider 1 for 0 deal as FREE
*/

export default defineSafeHandler(async (event) => {
	const { itemID, actualCount, adjustedCount } = await validateBody(event, schema)

	await prisma.$transaction(async (tx) => {
		const item = await tx.item.findUnique({
			where: {
				itemID: itemID,
			},
		})

		if (!item) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item does not exist" })
		}

		return await tx.deal.upsert({
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
	})

	return "Successfully edited deal"
})
