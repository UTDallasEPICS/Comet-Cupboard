import { z } from "zod"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }

const checkImageDimensions = async (file: File): Promise<boolean> => {
	const dataUrl = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => resolve(e.target?.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})

	return await new Promise<boolean>((resolve, reject) => {
		const img = new Image()
		img.onload = () => {
			const valid =
				img.width >= MIN_DIMENSIONS.width &&
				img.height >= MIN_DIMENSIONS.height &&
				img.width <= MAX_DIMENSIONS.width &&
				img.height <= MAX_DIMENSIONS.height
			resolve(valid)
		}
		img.onerror = reject
		img.src = dataUrl
	})
}

export const imageSchema = z.object({
	image: z
		.file()
		.mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], {
			message: "Invalid image type (JPG/PNG/WEBP only)",
		})
		.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" })
		.refine(
			async (file) =>
				checkImageDimensions(file).then(
					(valid) => valid,
					() => false
				),
			{
				message: `Image dimensions must be between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`,
			}
		),
})
