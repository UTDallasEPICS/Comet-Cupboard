import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		includeArchived: z.enum(["true", "false"]).default("false"),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { includeArchived } = validateQuery(event, schema)

	const items = await prisma.item.findMany({
		where: {
			...(includeArchived === "false" ? { archived: false } : {}),
		},
        include: {
            Category: true,
        },
	})

	return items
})
