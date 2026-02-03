import { z } from "zod"

const schema = z.object({
	includeArchived: z.string().default("false"),
})

const validateSchema = schema.strict().partial()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { includeArchived } = queries.data

	//Only administrators can view archived sources
	if (includeArchived === "true" && !event.context.permissions[AccessPermission.ADMIN]) {
		throw createError({ statusCode: 403, statusMessage: `User ${event.context.user.netID} is unauthorized to view archived sources` })
	}

	// retrieve the list of sources (including archived sources if allowed by includeArchived variable) from the db
	const sources = await event.context.prisma.source.findMany({
		where: {
			...((includeArchived === "false") ? { archived: false } : {}),
		},
		include: {
			Fields: true,
		},
		orderBy: {
			name: "asc",
		},
	})

	if (!sources) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find sources" })
	}
	return sources
})
