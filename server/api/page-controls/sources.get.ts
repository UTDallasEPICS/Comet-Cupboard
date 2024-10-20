export default defineEventHandler(async (event) => {
	// retrieve the list of sources from the db
	const sources = await event.context.prisma.source.findMany({
        select: {
            name: true,
        },
        orderBy: {
            name: 'asc',
        },
	})
	if (!sources) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find item" })
	}
	return sources
})
