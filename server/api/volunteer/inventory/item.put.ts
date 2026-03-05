import { z } from "zod"
import { unlink, writeFile } from "node:fs/promises"
import { prisma } from "#server/utils/db"
import { nanoid } from "nanoid"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const MAX_FILE_SIZE = 2 * 1024 * 1024
const uploadDirectory = "${process.env.IMAGE_UPLOAD_DIRECTORY}"

const schema = z
	.object({
		itemID: z.string(),
		name: z.string(),
		categoryName: z.string(),
		image: z
			.file()
			.mime(["image/jpeg", "image/jpg", "image/png"], {
				message: "Invalid image type (JPG/PNG only)",
			})
			.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" }),
	})
	.strict()
	.required()

/*
	Not providing itemID implies wanting to create a new item
	Providing itemID implies wanting to edit an existing item
*/

export default defineSafeHandler(async (event) => {
	const formData = await readFormData(event)
	const data = { image: formData.get("image"), name: formData.get("name"), categoryName: formData.get("categoryName"), itemID: formData.get("itemID") || "" }
	const result = schema.safeParse(data)

	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}

	const { name, categoryName, image, itemID } = result.data

	await prisma.$transaction(async (tx) => {
		const category = await tx.category.findUnique({ where: { name: categoryName } })
		if (!category) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Category does not exist" })
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

		if (oldImgName) {
			await unlink(`${uploadDirectory}/${oldImgName}`).catch(() => {})
		}
		const newImageType = image.type.split("/")[1]
		const newImgName = `${nanoid()}.${newImageType}`
		const newPath = `${uploadDirectory}/${newImgName}`

		// Convert Web File -> Buffer
		const buffer = Buffer.from(await image.arrayBuffer())
		await writeFile(newPath, buffer)

		let item
		if (itemID) {
			item = await tx.item.update({
				where: { itemID },
				data: { name, imgName: newImgName, categoryName, archived: false },
			})
		} else {
			item = await tx.item.create({
				data: { name, imgName: newImgName, categoryName, archived: false },
			})
		}
		return item
	})

	return "Successfully edited item"
})
