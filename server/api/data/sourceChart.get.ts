export default defineEventHandler(async (event) => {
	// retrieve the list of sources from the db
	const data = await event.context.prisma.itemCountChange.groupBy({
		by: ["date", "sourceName"],
		_sum: {
			amountChanged: true,
		},
	})
	if (!data) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find data" })
	}
})
