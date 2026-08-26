import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	return await prisma.location.findMany({
		where: {
			archived: false,
		},
		orderBy: { locationName: "asc" },
		select: {
			locationID: true,
			locationName: true,
			description: true,
			imgName: true,
			mapEmbedUrl: true,
			emergencyBags: {
				where: { private: false },
				select: {
					emergencyBagLabels: {
							where: { archived: false },
						select: { emergencyBagLabelName: true },
					},
				},
			},
		},
	})
})
