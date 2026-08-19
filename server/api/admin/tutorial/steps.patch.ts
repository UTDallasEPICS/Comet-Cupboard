import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		id: z.string().min(1),
		description: z.string().min(1, "Description cannot be empty"),
		removeImage: z.enum(["true", "false"]).default("false"),
	})
	.partial({
		image: true,
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { id, description, image, removeImage } = await validateFormData(event, schema)

	const existingStep = await prisma.tutorialStep.findUnique({
		where: {
			id,
		},
	})

	if (!existingStep) {
		throw createError({
			statusCode: 404,
			statusMessage: "Tutorial step doesn't exist",
		})
	}

	let imageURL = existingStep.imageURL

	if (removeImage === "true") {
		if (existingStep.imageURL) {
			await deleteImage(existingStep.imageURL)
		}

		imageURL = null
	} else if (image) {
		const newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))

		if (existingStep.imageURL) {
			await deleteImage(existingStep.imageURL)
		}

		imageURL = newImgName
	}

	const step = await prisma.tutorialStep.update({
		where: {
			id,
		},
		data: {
			description,
			imageURL,
		},
	})

	return step
})
