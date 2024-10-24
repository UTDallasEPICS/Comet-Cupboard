export default defineEventHandler(async (event) => {
    const { term } = getQuery(event);
    
    const currentTime = new Date();
    const staleCutOff = new Date(currentTime.valueOf() - 1800000); //current time -30 minutes

	// retrieve the list of carts from the db
	const carts = await event.context.prisma.cart.findMany({
        where: {
            cartID: { contains: term },
            date: { gte: staleCutOff },
        },
        select: {
            cartID: true
        },
        orderBy: [
            {
                date: 'desc',
            },
            {
                cartID: 'asc',
            },
        ],
	})
	if (!carts) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find carts" })
	}
	return carts
})
