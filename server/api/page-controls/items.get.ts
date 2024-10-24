export default defineEventHandler(async (event) => {
	// retrieve the list of items from the db
	const items = await event.context.prisma.item.findMany({
        select: {
            name: true,
            itemID: true,
        },
        orderBy: {
            name: 'asc',
        },
	})
	if (!items) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find items" })
	}
	return items
})
