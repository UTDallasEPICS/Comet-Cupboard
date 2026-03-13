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
		categoryName: z.string().min(1, "Category name cannot be empty"),
		archived: z.enum(["true", "false"]),
	})
	.strict()
	.partial({
		categoryName: true,
		archived: true,
		image: true,
	})
	.refine(
		({ categoryID, categoryName, archived, image }) => {
			if (categoryID === "") {
				// creating a new category, so all fields are required
				if (!categoryName || !archived || !image) {
					return false
				}
			}
			return true
		},
		{
			error: "categoryName, archived, and image are required when creating a new category",
		}
	)

export default defineSafeHandler(async (event) => {
	const { categoryName, image, categoryID, archived } = await validateFormData(event, schema)

	await prisma.$transaction(async (tx) => {
		// store old item image to delete later if editing an item
		let oldImgName = ""
		if (categoryID) {
			const existingCategory = await tx.category.findUnique({ where: { categoryID } })
			if (!existingCategory) {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Category does not exist" })
			}
			oldImgName = existingCategory.imgName
		}

		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		let category
		if (categoryID) {
			try {
				category = await tx.category.update({
					where: { categoryID },
					data: {
						...(categoryName !== undefined && { name: categoryName }),
						...(newImgName !== undefined && { imgName: newImgName }),
						...(archived !== undefined && { archived: archived === "true" }),
					},
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
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}
		return category
	})

	return "Successfully edited category"
})
