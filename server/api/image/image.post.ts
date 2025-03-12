import { formidable } from "formidable"
import { existsSync, mkdirSync } from "fs"
import { copyFile } from "node:fs/promises"
import { nanoid } from "nanoid"

const uploadDirectory = `${process.env.IMAGE_UPLOAD_DIRECTORY}`
if (!existsSync(uploadDirectory)) {
	mkdirSync(uploadDirectory)
}

export default defineEventHandler(async (event) => {
	const form = formidable()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [fields, files] = await form.parse(event.node.req)
	// make sure key for form data is image and length is 1
	if (!(files.image && files.image.length == 1)) {
		throw createError({ statusCode: 400, statusMessage: "Invalid form data" })
	}
	const image = files["image"][0]
	// check if image is a valid image
	if (!(image.mimetype && (image.mimetype === "image/jpeg" || image.mimetype === "image/png"))) {
		throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
	}
	const imageType = image.mimetype === "image/jpeg" ? "jpg" : "png"
	const imageName = nanoid() + "." + imageType
	const oldPath = image.filepath
	const newPath = `${uploadDirectory}/${imageName}`
	await copyFile(oldPath, newPath)
	return {
		imageName: imageName,
	}
})
