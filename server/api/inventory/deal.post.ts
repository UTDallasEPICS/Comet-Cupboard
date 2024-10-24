import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
	actualCount: z.number().int().positive(),
	adjustedCount: z.number().int().nonnegative(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, actualCount, adjustedCount } = result.data

	if (actualCount <= adjustedCount) {
		throw createError({ statusCode: 400, statusMessage: "adjustedCount must be less than actualCount" })
	}

	const item = await event.context.prisma.item.findUnique({
		where: {
			itemID: itemID,
		},
	})

	if (!item) {
		throw createError({ statusCode: 400, statusMessage: "Item does not exist" })
	}

	const deal = await event.context.prisma.deal.upsert({
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
		throw createError({ statusCode: 500, statusMessage: "Failed to create deal" })
	}
	return "Successfully created deal"
})
