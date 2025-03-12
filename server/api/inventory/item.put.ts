import { z } from "zod"
import { readFile, unlink } from "node:fs/promises"

const schema = z.object({
	itemID: z.string().default(""),
	name: z.string(),
	categoryName: z.string(),
	imgName: z.string(),
})

const validateSchema = schema.strict().required()

/*
	Not providing itemID implies wanting to create a new item
	Providing itemID implies wanting to edit an existing item
		If imgName is provided, ASSUME THAT THE IMAGE IS ALREADY UPLOADED (so POST image was successful) and we need to delete the old image
*/

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, name, categoryName, imgName } = result.data
	// check if category exists
	const category = await event.context.prisma.category.findUnique({
		where: {
			name: categoryName,
		},
	})
	if (!category) {
		throw createError({ statusCode: 400, statusMessage: "Category does not exist" })
	}

	// store old item name to delete later if needed
	let oldItemName = ""
	if (itemID && imgName) {
		const item = await event.context.prisma.item.findUnique({
			where: {
				itemID: itemID,
			},
		})
		if (!item) {
			throw createError({ statusCode: 500, statusMessage: "Failed to edit item" })
		}
		oldItemName = item.imgName

		// check if new imgName exists
		const imagePath = `${process.env.IMAGE_UPLOAD_DIRECTORY}/${imgName}`
		try {
			await readFile(imagePath)
		} catch (err) {
			if (err.code === "ENOENT") {
				throw createError({ statusCode: 404, statusMessage: `New file not found: ${imgName}` })
			} else {
				throw createError({ statusCode: 500, statusMessage: "Internal server error" })
			}
		}
	}

	const item = await event.context.prisma.item.upsert({
		where: {
			itemID: itemID,
		},
		update: {
			name: name,
			imgName: imgName,
			categoryName: categoryName,
		},
		create: {
			name: name,
			imgName: imgName,
			categoryName: categoryName,
		},
	})

	if (!item) {
		throw createError({ statusCode: 500, statusMessage: `Failed to edit item` })
	}

	if (itemID && imgName && oldItemName !== imgName) {
		// delete old image, if this fails we're not in that much trouble hopefully
		// kind of lazy to put the item back in the db if this fails
		await unlink(`${process.env.IMAGE_UPLOAD_DIRECTORY}/${oldItemName}`)
	}

	return `Successfully ${itemID ? "edited" : "created"} item: ${JSON.stringify(item)}`
})
