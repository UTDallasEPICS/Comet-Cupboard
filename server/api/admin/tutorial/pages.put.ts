import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		id: z.string().min(1),
		name: z
			.string()
			.min(1)
			.max(30)
			.regex(/^[A-Za-z ]+$/),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { id, name } = await validateBody(event, schema)

	const updatePageName = await prisma.tutorialPage.update({
		where: {
			id,
		},
		data: {
			name,
		},
	})

	return updatePageName
})
