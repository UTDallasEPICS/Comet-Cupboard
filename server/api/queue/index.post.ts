export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	// By default, put in the WAITING queue

	const queueEntry = await event.context.prisma.queueEntry.findUnique({
		where: {
			netID: netID,
		},
	})

	if (!queueEntry) {
		await event.context.prisma.queueEntry.create({
			data: {
				netID: netID,
				state: "WAITING",
			},
		})
		await broadcastToQueue(
			JSON.stringify({
				//The type will be QUEUE_ADD as the inside queue does not need to check for when items are added
				type: "QUEUE_ADD",
				payload: { netID: netID },
			})
		)
	}

	return `Successfully added ${event.context.user.netID} to queue`
})
