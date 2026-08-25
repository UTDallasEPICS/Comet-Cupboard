import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { dealSchema } from "#shared/utils/formSchemas"

const schema = dealSchema.extend({ itemID: z.string() }).strict()

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
