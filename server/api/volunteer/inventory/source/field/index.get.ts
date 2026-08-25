import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		sourceID: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { sourceID } = validateQuery(event, schema)

	const fields = await prisma.field.findMany({
		where: {
			sourceID: sourceID,
		},
		orderBy: {
			fieldName: "asc",
		},
	})

	return fields
})
