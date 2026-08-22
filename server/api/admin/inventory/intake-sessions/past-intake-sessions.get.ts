import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return await prisma.completedInventoryIntakeSession.findMany({
		orderBy: { intakeDate: "desc" },
		include: { completedInventoryIntakeSessionItems: { include: { specificItem: { include: { item: true } } } }, source: true },
	})
})
