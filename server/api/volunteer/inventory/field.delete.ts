import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	fieldID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { fieldID } = result.data

	const field = await prisma.field.delete({
		where: {
			fieldID: fieldID,
		},
	})

	if (!field) {
		throw createError({ statusCode: 500, statusMessage: "Failed to delete field: " + fieldID })
	}

	return field
})
