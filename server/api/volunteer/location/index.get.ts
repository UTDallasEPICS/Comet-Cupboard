import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		includeArchived: z.enum(["true", "false"]).default("false"),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { includeArchived } = validateQuery(event, schema)

	return await prisma.location.findMany({
		where: {
			...(includeArchived === "false" ? { archived: false } : {}),
		},
		orderBy: { locationName: "asc" },
	})
})
