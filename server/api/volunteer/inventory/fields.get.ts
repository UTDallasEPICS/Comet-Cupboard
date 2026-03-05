import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		source: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { source } = validateQuery(event, schema)

	const fields = await prisma.field.findMany({
		where: {
			sourceName: source,
		},
		orderBy: {
			name: "asc",
		},
	})

	return fields
})
