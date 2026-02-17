import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

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

	await prisma.queueEntry.delete({
		where: { netID },
	})

	await broadcastToQueue(
		JSON.stringify({
			type: "QUEUE_DELETE",
			payload: { netID },
		})
	)

	return `Successfully removed ${netID} from the queue`
})
