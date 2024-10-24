export default defineEventHandler(async (event) => {
    const { term } = getQuery(event);
	// retrieve the list of items from the db
	const items = await event.context.prisma.item.findMany({
        where: {
            name: { contains: term },
        },
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
