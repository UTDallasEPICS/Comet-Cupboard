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
	// delete item
	const item = await event.context.prisma.item.delete({
		where: {
			itemID: itemID,
		},
	})
	if (!item) {
		throw createError({ statusCode: 500, statusMessage: "Failed to delete item" })
	}
	return "Successfully deleted item"
})
