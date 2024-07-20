import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const params = await getValidatedRouterParams(event, (param) => validateSchema.safeParse(param))
	if (!params.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { itemID } = params.data
	// find item with corresponding itemID
	const item = await event.context.prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
	})
	if(!item) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find item" })
	}
	return item
})
