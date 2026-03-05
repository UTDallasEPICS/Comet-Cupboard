import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		includeArchived: z.string().default("false"),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { includeArchived } = validateQuery(event, schema)

	const sources = await prisma.source.findMany({
		where: {
			...(includeArchived === "false" ? { archived: false } : {}),
		},
		include: {
			Fields: true,
		},
		orderBy: {
			name: "asc",
		},
	})

	return sources
})
