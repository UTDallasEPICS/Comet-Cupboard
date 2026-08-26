import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return await prisma.itemLabel.findMany({
		where: { archived: false },
		select: { itemLabelName: true },
		orderBy: { itemLabelName: "asc" },
	})
})