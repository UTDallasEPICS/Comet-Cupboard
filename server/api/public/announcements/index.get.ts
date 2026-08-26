import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	const now = new Date()
	return await prisma.announcement.findMany({
		where: { startsAt: { lte: now }, endsAt: { gt: now } },
		orderBy: { startsAt: "desc" },
		select: { announcementID: true, message: true, startsAt: true, endsAt: true },
	})
})
