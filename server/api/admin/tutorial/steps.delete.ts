import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { deleteImage } from "#server/utils/image"

const schema = z
	.object({
		id: z.string().min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { id } = await validateBody(event, schema)

	const deleteStep = await prisma.tutorialStep.delete({
		where: {
			id,
		},
	})

	if (deleteStep.imageURL) {
		await deleteImage(deleteStep.imageURL)
	}

	return deleteStep
})
