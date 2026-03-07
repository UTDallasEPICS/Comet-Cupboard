import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		sourceID: z.string().default(""),
		name: z.string(),
		archived: z.boolean().default(false),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { sourceID, name, archived } = await validateBody(event, schema)

	await prisma.source.upsert({
		where: {
			sourceID: sourceID,
		},
		update: {
			name: name,
			archived: archived,
		},
		create: {
			name: name,
			archived: archived,
		},
	})

	return "Successfully added/updated source"
})
