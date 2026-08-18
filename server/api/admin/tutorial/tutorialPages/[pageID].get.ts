import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const page = await prisma.tutorialPage.findFirst({
		orderBy: {
			name: "asc",
		},
		include: {
			steps: true,
		},
	})

	return page
})
