import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return await prisma.dashboardLink.findMany({ orderBy: { displayOrder: "asc" } })
})
