import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	state: z.enum(["WAITING", "INSIDE"]),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { state } = queries.data

	// Return everyone in the queue by when they joined (get the netID)
	const queue = await prisma.queueEntry.findMany({
		where: { state },
		orderBy: { joinedAt: "asc" },
	})

	return queue
})
