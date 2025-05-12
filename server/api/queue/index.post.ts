import { broadcastToQueue } from "~/server/utils/queueVerificationUtil"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	//This error should never happen, but just in case
	if (!netID) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing netID in request body",
		})
	}

	// Grab the user from the database
	const user = await event.context.prisma.user.findUnique({
		where: { netID },
	})

	// If the user does not exist, throw an error
	// Also should never happen, but just in case
	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: `User with netID ${netID} not found`,
		})
	}

	// By default, put in the WAITING queue
	const newEntry = await event.context.prisma.queueEntry.create({
		data: {
			netID,
			state: "WAITING",
		},
	})

	await broadcastToQueue(
		JSON.stringify({
			//The type will be ADD_QUEUE as the inside queue does not need to check for when items are added
			type: "QUEUE_ADD",
			payload: { netID, action: "ADD" },
		})
	)

	return {
		message: "Successfully added to queue",
		queueEntry: newEntry,
	}
})
