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

	const step = await prisma.tutorialStep.create({
		data: {
			pageID,
			description,
			imageURL: newImgName,
		},
	})

	return step
})
