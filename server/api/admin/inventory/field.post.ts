import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		sourceID: z.string(),
		fieldName: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { sourceID, fieldName } = await validateBody(event, schema)

	await prisma.field.create({
		data: {
			name: fieldName,
			sourceID: sourceID,
		},
	})

	return "Field added successfully"
})
