import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		source: z.string(),
		fieldName: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { source, fieldName } = await validateBody(event, schema)

	await prisma.field.create({
		data: {
			name: fieldName,
			sourceName: source,
		},
	})

	return "Field added successfully"
})
