import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		pageID: z.string().min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { pageID } = await validateBody(event, schema)

	const deletePage = await prisma.tutorialPage.delete({
		where: {
			id: pageID
		},
	})

	return deletePage
})
