import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { inventoryItemDetailsSchema } from "#shared/utils/formSchemas"
import { imageSchema, uploadImage, processImage } from "#server/utils/image"

const schema = inventoryItemDetailsSchema
	.extend({ itemID: z.string(), archived: z.enum(["true", "false"]), image: imageSchema.shape.image.optional() })
	.strict()

export default defineSafeHandler(async (event) => {
	const { itemName, categoryID, itemID, archived, image } = await validateFormData(event, schema)

	if (!itemID) {
		if (!image) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "An image is required to create an item" })
		}

		const newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))

		return await prisma.$transaction(async (tx) => {
			const newItem = await tx.item.create({
				data: {
					itemName,
					categoryID,
					archived: archived === "true",
					specificItems: {
						create: {
							productName: "Default",
							imgName: newImgName,
							quantity: 0,
						},
					},
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_CREATED",
					message: `Item created: ${newItem.itemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newItem
		})
	} else {
		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedItem = await tx.item.update({
				where: { itemID },
				data: {
					itemName,
					categoryID,
					archived: archived === "true",
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_EDITED",
					message: `Item updated: ${updatedItem.itemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedItem
		})

		return transactionResult
	}
})
