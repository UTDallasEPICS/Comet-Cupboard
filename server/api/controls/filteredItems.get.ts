import { z } from "zod"

const schema = z.object({
	term: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { term } = queries.data

	// retrieve the list of filtered items from the db
	const items = await event.context.prisma.item.findMany({
		where: {
			name: { contains: term },
		},
		select: {
			name: true,
		},
		orderBy: {
			name: "asc",
		},
	})
	if (!items) {
		throw createError({ statusCode: 500, statusMessage: `Failed to find items with search term ${term}` })
	}
	return items
})
