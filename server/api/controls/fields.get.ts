import { z } from "zod"

const schema = z.object({
	source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	const { source } = result.data

	const fields = await event.context.prisma.field.findMany({
		where: {
			sourceName: source,
		},
		select: {
			fieldID: true,
			name: true,
		},
		orderBy: {
			name: "asc",
		},
	})

	return fields
})
