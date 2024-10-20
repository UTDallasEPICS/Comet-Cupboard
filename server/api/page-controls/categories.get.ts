export default defineEventHandler(async (event) => {
	// retrieve the list of categories from the db
	const categories = await event.context.prisma.category.findMany({
        select: {
            name: true
        },
        orderBy: {
            name: 'asc',
        },
	})
	if (!categories) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find item" })
	}
	return categories
})
