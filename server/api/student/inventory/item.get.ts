import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { itemID } = validateQuery(event, schema)

	const item = await prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
		include: {
			deal: true,
			specificItems: {
				include: {
					itemLabels: true,
				},
			},
			category: true,
		},
	})
	if (!item) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
	}

	return item
})
