import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"
import { validateFormData } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"
import { tutorialStepSchema } from "#shared/utils/formSchemas"

const schema = tutorialStepSchema
	.extend({
		tutorialStepID: z.string(),
		tutorialID: z.string().min(1),
		image: imageSchema.shape.image,
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { tutorialStepID, tutorialID, description, image } = await validateFormData(event, schema)

	if (!tutorialStepID) {
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}
		return await prisma.$transaction(async (tx) => {
			// Get the current maximum stepOrdering for the given tutorialID
			const maxStepOrdering = await tx.tutorialStep.aggregate({
				where: { tutorialID },
				_max: { stepOrdering: true },
			})

			// Determine the new stepOrdering value
			const stepOrdering = (maxStepOrdering._max.stepOrdering ?? 0) + 1

			// Create the new tutorial step
			const newStep = await tx.tutorialStep.create({
				data: {
					tutorialID,
					description,
					imageUrl: newImgName!,
					stepOrdering,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "TUTORIAL_EDITED",
					message: `Tutorial step created: ${newStep.tutorialStepID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newStep
		})
	} else {
		let oldImgName = ""
		const existingStep = await prisma.tutorialStep.findUnique({ where: { tutorialStepID } })
		if (!existingStep) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Tutorial step does not exist` })
		}
		oldImgName = existingStep.imageUrl
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedStep = await tx.tutorialStep.update({
				where: { tutorialStepID },
				data: {
					description,
					imageUrl: newImgName ?? oldImgName,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "TUTORIAL_EDITED",
					message: `Tutorial step updated: ${updatedStep.tutorialStepID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedStep
		})

		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}

		return transactionResult
	}
})
