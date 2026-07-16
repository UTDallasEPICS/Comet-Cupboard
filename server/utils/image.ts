import sharp from "sharp"
import { unlink, writeFile } from "node:fs/promises"
import { nanoid } from "nanoid"
import { z } from "zod"

const uploadDirectory = process.env.IMAGE_UPLOAD_DIRECTORY ?? "images"
const MAX_FILE_SIZE = 2 * 1024 * 1024

export const imageSchema = z.object({
	image: z
		.file()
		.mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], {
			message: "Invalid image type (JPG/PNG/WEBP only)",
		})
		.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" }),
})

export const processImage = async (buffer: Buffer) => {
	return await sharp(buffer).resize({ width: 1200 }).webp({ quality: 75 }).toBuffer()
}

export const deleteImage = async (imgName: string) => {
	await unlink(`${uploadDirectory}/${imgName}`).catch(() => {})
}

export const uploadImage = async (buffer: Buffer) => {
	const processedBuffer = await processImage(buffer)
	const newImgName = `${nanoid()}.webp`
	const newPath = `${uploadDirectory}/${newImgName}`
	await writeFile(newPath, processedBuffer)
	return newImgName
}
