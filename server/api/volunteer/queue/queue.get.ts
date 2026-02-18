import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const queue = await prisma.queueEntry.findMany({
		orderBy: { position: "asc" },
	})
	return queue
})
