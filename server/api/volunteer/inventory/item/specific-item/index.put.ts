import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"
import { specificProductSchema } from "#shared/utils/formSchemas"

const schema = specificProductSchema
	.extend({
		specificItemID: z.string().optional(),
		itemID: z.string(),
		itemLabels: z.string().optional(),
		image: imageSchema.shape.image.optional(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { specificItemID, productName, itemID, image, itemLabels } = await validateFormData(event, schema)

	const itemLabelNames = itemLabels ? specificProductSchema.shape.itemLabels.parse(JSON.parse(itemLabels)) : []

	const itemLabelConnections = itemLabelNames.map((itemLabelName) => ({
		itemLabelName,
	}))

	if (!specificItemID) {
		let newImgName = ""

		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		return await prisma.$transaction(async (tx) => {
			const newSpecificItem = await tx.specificItem.create({
				data: {
					productName,
					imgName: newImgName,
					itemID,
					quantity: 0,
					itemLabels: {
						connect: itemLabelConnections,
					},
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
		const existingSpecificItem = await prisma.specificItem.findUnique({
			where: { specificItemID },
		})

		if (!existingSpecificItem) {
			throw createError({
				statusCode: StatusCodes.NOT_FOUND,
				statusMessage: "Specific Item does not exist",
			})
		}

		if (existingSpecificItem.productName === "Default" && productName !== "Default") {
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "The Default specific product cannot be renamed",
			})
		}

		const oldImgName = existingSpecificItem.imgName
		let newImgName: string | undefined

		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedSpecificItem = await tx.specificItem.update({
				where: { specificItemID },
				data: {
					productName,
					imgName: newImgName ?? oldImgName,
					itemLabels: {
						set: [],
						connect: itemLabelConnections,
					},
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

		// Delete the old image only after the database transaction succeeds.
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}

		return transactionResult
	}
})
