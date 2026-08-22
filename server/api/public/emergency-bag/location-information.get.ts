import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	return await prisma.location.findMany({
		where: {
			archived: false,
		},
		orderBy: { locationName: "asc" },
		include: {
			emergencyBags: {
				// private bags will typically be at "no location"
				where: {
					private: false,
				},
				include: {
					emergencyBagLabels: true,
				},
                // labels should be enough for aggregation
				select: {},
			},
		},
	})
})
