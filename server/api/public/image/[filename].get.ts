import { z } from "zod"
import path from "node:path"
import { readFile } from "node:fs/promises"
import { StatusCodes } from "http-status-codes"
import { validateParams } from "#server/utils/validation"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z
	.object({
		filename: z.string().regex(/^[a-zA-Z0-9._-]+$/),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { filename } = validateParams(event, schema)

	const baseDir = process.env.IMAGE_UPLOAD_DIRECTORY!
	const resolvedPath = path.resolve(baseDir, filename)

	// Ensure the resolved path is within the base directory to prevent directory traversal attacks
	if (!resolvedPath.startsWith(path.resolve(baseDir))) {
		throw createError({
			statusCode: StatusCodes.BAD_REQUEST,
			statusMessage: "Invalid file path",
		})
	}

	// PLEASE OH PLEASE KEEP THIS ASYNC
	const contents = await readFile(resolvedPath)

	const fileType = filename.split(".").pop()?.toLowerCase()
	if (fileType === "jpg" || fileType === "jpeg") {
		setResponseHeader(event, "Content-Type", "image/jpeg")
	} else if (fileType === "png") {
		setResponseHeader(event, "Content-Type", "image/png")
	}
	return contents
})
