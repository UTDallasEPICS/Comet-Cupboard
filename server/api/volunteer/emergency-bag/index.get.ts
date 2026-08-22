import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateQuery } from "#server/utils/validation"

const schema = z.object({
	emergencyBagID: z.string().optional(),
})

export default defineSafeHandler(async (event) => {
	const { emergencyBagID } = validateQuery(event, schema)

	const emergencyBags = await prisma.emergencyBag.findMany({
		where: {
			private: false,
			...(emergencyBagID ? { emergencyBagID } : {}),
		},
		include: {
			emergencyBagItems: {
				include: {
					specificItem: { include: { item: true } },
				},
			},
			emergencyBagLabels: true,
			location: true,
		},
	})

	return emergencyBags
})
