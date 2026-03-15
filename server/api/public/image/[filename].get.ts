import { z } from "zod"
import path from "node:path"
import { readFile } from "node:fs/promises"
import { StatusCodes } from "http-status-codes"
import { validateParams } from "#server/utils/validation"
import { defineSafeHandler } from "#server/utils/handler"
import mime from "mime-types"

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

	const mimeType = mime.lookup(filename) || "application/octet-stream"
	setResponseHeader(event, "Content-Type", mimeType)
	
	return contents
})
