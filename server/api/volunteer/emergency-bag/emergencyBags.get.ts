//import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const emBags = await prisma.emergencyBag.findMany({
		where: {
			private: false,
		},
		include: {
			EmergencyBagItems: {
				include: {
					Item: true,
				},
			},
		},
	})

	return emBags
})
