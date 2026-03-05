import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const categories = await prisma.category.findMany({
		select: {
			name: true,
		},
		orderBy: {
			name: "asc",
		},
	})
	return categories
})
