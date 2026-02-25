import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	checkAvailability: z.string().default("false"),
	includeArchived: z.string().default("false"),
})

const validateSchema = schema.strict().partial()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { checkAvailability, includeArchived } = queries.data

	const items = await prisma.item.findMany({
		where: {
			// if checking availability, count must be greater than 0
			// and archived must be false
			...((checkAvailability === "true") ? { quantity: { gt: 0 } } : {}),
			...((includeArchived === "false") ? { archived: false } : {})
		},
		include: {
			Deal: true,
		},
	})
	if (!items) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find items" })
	}
	return items
})
