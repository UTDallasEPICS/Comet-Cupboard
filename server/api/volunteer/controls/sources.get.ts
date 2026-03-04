import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	includeArchived: z.string().default("false"),
})

const validateSchema = schema.strict().partial()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request parameters" })
	}
	const { includeArchived } = queries.data

	//Only administrators can view archived sources
	if (includeArchived === "true" && !event.context.permissions[AccessPermission.ADMIN]) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: `User ${event.context.user.netID} is unauthorized to view archived sources` })
	}

	// retrieve the list of sources (including archived sources if allowed by includeArchived variable) from the db
	const sources = await prisma.source.findMany({
		where: {
			...(includeArchived === "false" ? { archived: false } : {}),
		},
		include: {
			Fields: true,
		},
		orderBy: {
			name: "asc",
		},
	})

	if (!sources) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to find sources" })
	}
	return sources
})
