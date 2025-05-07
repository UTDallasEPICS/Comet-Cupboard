export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event)
		const state = query.state

		// If trying to put in a queue that is not WAITING or INSIDE, throw an error
		if (state !== "WAITING" && state !== "INSIDE") {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid or missing queue state. Use WAITING or INSIDE.",
			})
		}

		// Return everyone in the queue by when they joined (get the netID)
		const queue = await event.context.prisma.queueEntry.findMany({
			where: { state },
			orderBy: { joinedAt: "asc" },
			select: {
				netID: true,
			},
		})
		return queue
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to fetch queue",
		})
	}
})
