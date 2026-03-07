import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		categoryID: z.string().default(""),
		categoryName: z.string(),
		archived: z.string().default("false"),
	})
	.strict()
	.required()

/*
	Not providing categoryID implies wanting to create a new category
	Providing categoryID implies wanting to edit an existing category
*/

export default defineSafeHandler(async (event) => {
	const { categoryName, image, categoryID, archived } = await validateFormData(event, schema)

	await prisma.$transaction(async (tx) => {
		// store old item image to delete later if editing an item
		let oldImgName = ""
		if (categoryID) {
			const existingCategory = await tx.category.findUnique({ where: { categoryID } })
			if (!existingCategory) {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Category does not exist` })
			}
			oldImgName = existingCategory.imgName
		}

		const newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))

		let category
		if (categoryID) {
			try {
				category = await tx.category.update({
					where: { categoryID },
					data: { name: categoryName, imgName: newImgName, archived: archived === "true" },
				})
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Category not found" })
				}
				throw error
			}
		} else {
			category = await tx.category.create({
				data: { name: categoryName, imgName: newImgName, archived: archived === "true" },
			})
		}

		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName) {
			await deleteImage(oldImgName)
		}
		return category
	})

	return "Successfully edited category"
})
