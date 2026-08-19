import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const groups = await prisma.tutorialGroup.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			pages: {
				include: {
					steps: {
						orderBy: {
							stepOrdering: "asc",
						},
					},
				},
			},
		},
	})

	return groups
})
