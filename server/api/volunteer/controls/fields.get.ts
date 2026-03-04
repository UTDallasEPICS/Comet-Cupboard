import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request parameters" })
	}

	const { source } = result.data

	const fields = await prisma.field.findMany({
		where: {
			sourceName: source,
		},
		orderBy: {
			name: "asc",
		},
	})

	return fields
})
