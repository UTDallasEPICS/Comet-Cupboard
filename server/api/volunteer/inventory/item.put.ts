import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
	.extend({
		itemID: z.string().default(""),
		name: z.string().min(1, "Name cannot be empty"),
		categoryName: z.string(),
		archived: z.enum(["true", "false"]),
	})
	.strict()
	.partial({
		name: true,
		categoryName: true,
		image: true,
		archived: true,
	})
	.refine(
		({ itemID, name, categoryName, image, archived }) => {
			if (itemID === "") {
				// creating a new item, so all fields are required
				if (!name || !categoryName || !image || !archived) {
					return false
				}
			}
			return true
		},
		{
			error: "name, categoryName, image, and archived are required when creating a new item",
		}
	)

export default defineSafeHandler(async (event) => {
	const { name, categoryName, image, itemID, archived } = await validateFormData(event, schema)
	await prisma.$transaction(async (tx) => {
		if (categoryName) {
			const category = await tx.category.findUnique({ where: { name: categoryName } })
			if (!category) {
				throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Category does not exist" })
			}
		}

		// store old item image to delete later if editing an item
		let oldImgName = ""
		if (itemID) {
			const existingItem = await tx.item.findUnique({ where: { itemID } })
			if (!existingItem) {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `Item does not exist` })
			}
			oldImgName = existingItem.imgName
		}
		let newImgName = undefined
		if (image) {
			newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
		}

		let item
		if (itemID) {
			try {
				item = await tx.item.update({
					where: { itemID },
					data: {
						...(name !== undefined && { name: name }),
						...(image !== undefined && { imgName: newImgName }),
						...(categoryName !== undefined && { categoryName }),
						...(archived !== undefined && { archived: archived === "true" }),
					},
				})
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
				}
				throw error
			}
		} else {
			item = await tx.item.create({
				data: {
					name: name,
					imgName: newImgName,
					categoryName: categoryName,
					archived: archived === "true",
				},
			})
		}
		// safest way to ensure we don't accidentally delete an image if something goes wrong during the transaction
		if (oldImgName && newImgName) {
			await deleteImage(oldImgName)
		}
		return item
	})

	return "Successfully edited item"
})
