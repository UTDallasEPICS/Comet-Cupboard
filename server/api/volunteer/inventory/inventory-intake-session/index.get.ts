import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	return await prisma.inventoryIntakeSession.findMany({
		orderBy: { intakeDate: "desc" },
	})
})
