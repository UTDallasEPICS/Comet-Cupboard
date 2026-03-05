import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const queue = await prisma.queueEntry.findMany({
		orderBy: { position: "asc" },
	})
	return queue
})
