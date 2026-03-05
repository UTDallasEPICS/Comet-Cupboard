import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		source: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { source } = await validateBody(event, schema)

	await prisma.source.upsert({
		where: {
			name: source,
		},
		update: {
			archived: false,
		},
		create: {
			name: source,
			archived: false,
		},
	})

	return "Successfully added/updated source"
})
