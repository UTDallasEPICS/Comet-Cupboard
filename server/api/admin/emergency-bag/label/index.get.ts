import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z.object({ includeArchived: z.enum(["true", "false"]).default("false") }).strict()

export default defineSafeHandler(async (event) => {
	const { includeArchived } = validateQuery(event, schema)

	return await prisma.emergencyBagLabel.findMany({
		where: includeArchived === "true" ? {} : { archived: false },
		orderBy: { emergencyBagLabelName: "asc" },
	})
})