import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { itemID } = result.data

	const deal = await prisma.deal.delete({
		where: {
			itemID: itemID,
		},
	})
	if (!deal) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: `Failed to delete deal for item with id ${itemID}` })
	}
	return `Successfully deleted deal for item with id ${itemID}`
})
