import { z } from "zod"

const schema = z.object({
	source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { source } = result.data

	const fields = await event.context.prisma.field.findMany({
		where: {
			sourceName: source,
		},
		orderBy: {
			name: "asc",
		},
	})

	return fields
})
