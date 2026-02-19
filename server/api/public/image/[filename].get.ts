import { z } from "zod"
import { readFile } from "node:fs/promises"

const schema = z.object({
	filename: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const params = await getValidatedRouterParams(event, (query) => validateSchema.safeParse(query))
	const { filename } = params.data
	const imagePath = `${process.env.IMAGE_UPLOAD_DIRECTORY}/${filename}`
	try {
		// PLEASE OH PLEASE KEEP THIS ASYNC
		const contents = await readFile(imagePath)
		return contents
	} catch (err) {
		if (err.code === "ENOENT") {
			throw createError({ statusCode: 404, statusMessage: `File not found: ${filename}` })
		} else {
			throw createError({ statusCode: 500, statusMessage: "Internal server error" })
		}
	}
})
