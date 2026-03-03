import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	source: z.string(),
	fieldName: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { source, fieldName } = result.data

	const field = await prisma.field.create({
		data: {
			name: fieldName,
			sourceName: source,
		},
	})

	if (!field) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to add field: " + fieldName })
	}

	return field
})
