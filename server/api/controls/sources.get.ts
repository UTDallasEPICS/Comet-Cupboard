export default defineEventHandler(async (event) => {
	// retrieve the list of sources from the db
	const sources = await event.context.prisma.source.findMany({
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
