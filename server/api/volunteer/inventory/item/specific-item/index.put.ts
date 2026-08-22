import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		specificItemID: z.string(),
		productName: z.string().min(1, "Name cannot be empty").max(100, "Name must be at most 100 characters"),
		itemID: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { specificItemID, productName, itemID, image } = await validateFormData(event, schema)

	if (!specificItemID) {
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}
		return await prisma.$transaction(async (tx) => {
			const newSpecificItem = await tx.specificItem.create({
				data: {
					specificItemID,
					productName,
					imgName: newImgName!,
                    itemID: itemID,
                    quantity: 0,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_EDITED",
					message: `Specific Item created: ${newSpecificItem.specificItemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newSpecificItem
		})
	} else {
		let oldImgName = ""
		const existingSpecificItem = await prisma.specificItem.findUnique({ where: { specificItemID } })
		if (!existingSpecificItem) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Specific Item does not exist` })
		}
		oldImgName = existingSpecificItem.imgName
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedSpecificItem = await tx.specificItem.update({
				where: { specificItemID },
				data: {
					productName,
					imgName: newImgName ?? oldImgName,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_EDITED",
					message: `Specific Item updated: ${updatedSpecificItem.specificItemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedSpecificItem
		})

		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}

		return transactionResult
	}
})
