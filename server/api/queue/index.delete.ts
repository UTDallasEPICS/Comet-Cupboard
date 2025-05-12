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

	await event.context.prisma.queueEntry.delete({
		where: { netID },
	})

	await broadcastToQueue(
		JSON.stringify({
			type: "QUEUE_UPDATE",
			payload: { netID, action: "DELETE" },
		})
	)

	return { message: `Successfully removed ${netID} from the queue` }
})
