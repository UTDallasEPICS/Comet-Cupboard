import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return await prisma.emergencyBagLabel.findMany({
		where: { archived: false },
		select: { emergencyBagLabelName: true },
		orderBy: { emergencyBagLabelName: "asc" },
	})
})