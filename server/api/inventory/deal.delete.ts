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

	const deal = await prisma.deal.delete({
		where: {
			itemID: itemID,
		},
	})
	if (!deal) {
		throw createError({ statusCode: 500, statusMessage: `Failed to delete deal for item with id ${itemID}` })
	}
	return `Successfully deleted deal for item with id ${itemID}`
})
