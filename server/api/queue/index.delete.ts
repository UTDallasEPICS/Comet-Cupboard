import { broadcastToQueue } from "~/server/utils/queueVerificationUtil"
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

	await event.context.prisma.queueEntry.delete({
		where: { netID },
	})

	await broadcastToQueue(
		JSON.stringify({
			type: "QUEUE_UPDATE",
			payload: { netID, action: "DELETE" },
		})
	)

	return `Successfully removed ${netID} from the queue`
})
