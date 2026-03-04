import { prisma } from "#server/utils/db"

export default defineEventHandler(async (event) => {
	const queue = await prisma.queueEntry.findMany({
		orderBy: { position: "asc" },
		select: {
			position: true,
			publicCode: true,
		},
	})
	return queue
})
