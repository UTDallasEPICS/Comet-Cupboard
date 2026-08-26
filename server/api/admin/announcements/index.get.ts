import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return await prisma.announcement.findMany({
		orderBy: { startsAt: "desc" },
	})
})
