import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		includeArchived: z.enum(["true", "false"]).default("false"),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { includeArchived } = validateQuery(event, schema)

	const sources = await prisma.source.findMany({
		where: {
			...(includeArchived === "false" ? { archived: false } : {}),
		},
		include: {
			fields: true,
		},
		orderBy: {
			sourceName: "asc",
		},
	})

	return sources
})
