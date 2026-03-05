import { z } from "zod"
import { readFile } from "node:fs/promises"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	filename: z.string(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const params = await getValidatedRouterParams(event, (query) => validateSchema.safeParse(query))
	const { filename } = params.data
	const imagePath = `${process.env.IMAGE_UPLOAD_DIRECTORY}/${filename}`
	try {
		// PLEASE OH PLEASE KEEP THIS ASYNC
		const contents = await readFile(imagePath)
		const fileType = filename.split(".").pop()?.toLowerCase()
		if (fileType === "jpg" || fileType === "jpeg") {
			setResponseHeader(event, "Content-Type", "image/jpeg")
		} else if (fileType === "png") {
			setResponseHeader(event, "Content-Type", "image/png")
		}
		return contents
	} catch (err) {
		if (err.code === "ENOENT") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: `File not found: ${filename}` })
		} else {
			throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Internal server error" })
		}
	}
})
