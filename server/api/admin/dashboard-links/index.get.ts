import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	return await prisma.dashboardLink.findMany({
		where: { dashboardRolePage: "ADMIN" },
		orderBy: { displayOrder: "asc" },
		select: { dashboardLinkID: true, displayName: true, url: true, description: true },
	})
})
