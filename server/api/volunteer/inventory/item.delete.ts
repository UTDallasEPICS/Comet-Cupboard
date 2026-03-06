import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID } = await validateBody(event, schema)

	try {
		// delete item (really just archive it)
		await prisma.item.update({
			where: {
				itemID: itemID,
			},
			data: {
				archived: true,
				quantity: 0, // Reset inventory upon deleting
			},
		})
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No item found with id" })
		}
		throw error
	}

	return "Successfully archived item"
})
