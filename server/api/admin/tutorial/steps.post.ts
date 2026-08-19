import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		pageID: z.string().min(1),
		description: z.string().min(1, "Description cannot be empty"),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { pageID, description, image } = await validateFormData(event, schema)

	let newImgName = undefined
	if (image) {
		newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
	}

	const transaction = await prisma.$transaction(async (tx) => {
		// Get the current maximum stepOrdering for the given pageID
		const maxStepOrdering = await tx.tutorialStep.aggregate({
			where: { pageID },
			_max: { stepOrdering: true },
		})

		// Determine the new stepOrdering value
		const stepOrdering = (maxStepOrdering._max.stepOrdering ?? 0) + 1

		// Create the new tutorial step
		const newStep = await tx.tutorialStep.create({
			data: {
				pageID,
				description,
				imageURL: newImgName,
				stepOrdering,
			},
		})

		return newStep
	})

	return transaction
})
