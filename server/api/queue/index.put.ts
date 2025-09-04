import { z } from "zod"

const schema = z.object({
	netID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { netID } = result.data

	const newEntry = await event.context.prisma.queueEntry.update({
		where: { netID },
		data: { state: "INSIDE" },
	})

	//Broadcast to the queue that the user has moved to INSIDE queue
	await broadcastToQueue(
		JSON.stringify({
			type: "QUEUE_MOVE_INSIDE",
			payload: newEntry,
		})
	)

	return `Successfully moved ${netID} to INSIDE queue`
})
