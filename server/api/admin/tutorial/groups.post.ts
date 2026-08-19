import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		name: z
			.string()
			.min(1)
			.max(20)
			.regex(/^[A-Za-z ]+$/),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { name } = await validateBody(event, schema)

	const group = await prisma.tutorialGroup.create({
		data: {
			name: name,
		},
	})

	return group
})
