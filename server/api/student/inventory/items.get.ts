import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

// quantity and archived information are not sensitive information to students
const schema = z
	.object({
		checkAvailability: z.enum(["true", "false"]).default("false"),
		includeArchived: z.enum(["true", "false"]).default("false"),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { checkAvailability, includeArchived } = validateQuery(event, schema)

	const items = await prisma.item.findMany({
		where: includeArchived === "false" ? { archived: false } : {},
		include: {
			deal: true,
			specificItems: true,
			category: true,
		},
	})

	return items
		.map((item) => ({
			...item,
			specificItems: item.specificItems.filter((specificItem) => checkAvailability === "false" || Number(specificItem.quantity) > 0),
		}))
})
