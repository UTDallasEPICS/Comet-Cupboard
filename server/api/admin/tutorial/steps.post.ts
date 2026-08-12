import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		pageID: z.string().min(1),
		description: z.string().min(1),
		imageURL: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { pageID, description, imageURL } = await validateBody(event, schema)

	const step = await prisma.tutorialStep.create({
		data: {
			pageID,
			description,
			imageURL,
		},
	})

	return step
})
