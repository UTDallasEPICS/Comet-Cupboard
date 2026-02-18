import { z } from "zod"
import { existsSync, mkdirSync } from "fs"
import { writeFile } from "node:fs/promises"
import { nanoid } from "nanoid"

const uploadDirectory = `${process.env.IMAGE_UPLOAD_DIRECTORY}`
if (!existsSync(uploadDirectory)) {
	mkdirSync(uploadDirectory)
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

const schema = z.object({
	image: z
		.file()
		.mime(["image/jpeg", "image/jpg", "image/png"], {
			message: "Invalid image type (JPG/PNG only)",
		})
		.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" }),
})

export default defineEventHandler(async (event) => {
	const formData = await readFormData(event)
	const data = { image: formData.get("image") }
	const result = schema.safeParse(data)

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}

	const { image } = result.data

	const imageType = image.type.split("/")[1]
	const imageName = `${nanoid()}.${imageType}`
	const newPath = `${uploadDirectory}/${imageName}`

	// Convert Web File -> Buffer
	const buffer = Buffer.from(await image.arrayBuffer())

	await writeFile(newPath, buffer)

	return { imageName }
})
