import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		categoryID: z.string(),
		categoryName: z.string().min(1, "Category name cannot be empty"),
		archived: z.enum(["true", "false"]),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { categoryName, image, categoryID, archived } = await validateFormData(event, schema)

	if (!categoryID) {
		return await prisma.$transaction(async (tx) => {
			let newImgName = undefined
			if (image) {
				newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
			}

			const newCategory = await tx.category.create({ data: { categoryName, archived: archived === "true", imgName: newImgName! } })
			await tx.auditLog.create({
				data: {
					action: "CATEGORY_CREATED",
					message: `Category created: ${newCategory.categoryName}`,
					userID: event.context.userSession.userID,
				},
			})
			return newCategory
		})
	} else {
		let oldImgName = ""
		const existingCategory = await prisma.category.findUnique({ where: { categoryID } })
		if (!existingCategory) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Category does not exist` })
		}
		oldImgName = existingCategory.imgName
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedCategory = await tx.category.update({
				where: { categoryID },
				data: {
					categoryName,
					imgName: newImgName ?? oldImgName,
					archived: archived === "true",
				},
			})
			await tx.auditLog.create({
				data: {
					action: "CATEGORY_EDITED",
					message: `Category updated: ${updatedCategory.categoryID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedCategory
		})

		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}

		return transactionResult
	}
})
