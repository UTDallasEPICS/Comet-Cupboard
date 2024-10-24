import { z } from "zod"

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

	const deal = await event.context.prisma.deal.delete({
		where: {
			itemID: itemID,
		},
	})
	if (!deal) {
		throw createError({ statusCode: 500, statusMessage: "Failed to delete deal" })
	}
	return "Successfully deleted deal"
})
