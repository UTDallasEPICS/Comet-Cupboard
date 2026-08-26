import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"
import { descriptionSchema, editLocationSchema, locationNameSchema } from "#shared/utils/formSchemas"

const schema = editLocationSchema
	.extend({
		locationID: z.string(),
		locationName: locationNameSchema,
		description: descriptionSchema,
		archived: z.enum(["true", "false"]),
		image: imageSchema.shape.image,
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { locationID, locationName, description, mapEmbedUrl, archived, image } = await validateFormData(event, schema)

	if (!locationID) {
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}
		return await prisma.$transaction(async (tx) => {
			const newLocation = await tx.location.create({
				data: {
					locationName: locationName,
					imgName: newImgName!,
					description: description,
					mapEmbedUrl: mapEmbedUrl || null,
					archived: archived === "true",
				},
			})
			await tx.auditLog.create({
				data: {
					action: "LOCATION_CREATED",
					message: `Location created: ${newLocation.locationID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newLocation
		})
	} else {
		let oldImgName = ""
		const existingLocation = await prisma.location.findUnique({ where: { locationID } })
		if (!existingLocation) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Location does not exist` })
		}
		oldImgName = existingLocation.imgName
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedLocation = await tx.location.update({
				where: { locationID },
				data: {
					locationName,
					description,
					mapEmbedUrl: mapEmbedUrl || null,
					archived: archived === "true",
					imgName: newImgName ?? oldImgName,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "LOCATION_EDITED",
					message: `Location updated: ${updatedLocation.locationID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedLocation
		})

		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}

		return transactionResult
	}
})
