import { broadcastToQueue } from "~/server/utils/queueVerificationUtil"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const netID = body.netID

	//If no id is provided, throw an error
	if (!netID) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing netID in request body",
		})
	}

	const existingEntry = await event.context.prisma.queueEntry.findUnique({
		where: { netID },
	})

	// If there is no querry entry with that netID, throw an error
	if (!existingEntry) {
		throw createError({
			statusCode: 404,
			statusMessage: "Queue entry not found for this netID",
		})
	}

	//If the user is not in WAITING queue, throw an error
	if (existingEntry.state !== "WAITING") {
		throw createError({
			statusCode: 400,
			statusMessage: "User is not in the WAITING queue",
		})
	}

	const newEntry = await event.context.prisma.queueEntry.update({
		where: { netID },
		data: { state: "INSIDE" },
	})

	//Broadcast to the queue that the user has moved to INSIDE queue
	await broadcastToQueue(
		JSON.stringify({
			type: "QUEUE_UPDATE",
			payload: newEntry,
		})
	)

	return {
		message: "Successfully moved to INSIDE queue",
		queueEntry: newEntry,
	}
})
