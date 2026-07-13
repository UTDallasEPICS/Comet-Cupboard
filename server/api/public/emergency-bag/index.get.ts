import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

const querySchema = z.object({
	label: z.string().length(5, "Bag ID must be 5 digits"),
})

export default defineSafeHandler(async (event) => {
	const query = getQuery(event)
	const { label } = querySchema.parse(query)

	//search the db for bag
	const emergencyBag = await prisma.emergencyBag.findUnique({
		where: { label: label },
		include: {
			EmergencyBagItems: {
				include: {
					Item: true,
				},
			},
		},
	})

	if (!emergencyBag) {
		throw createError({
			statusCode: 404,
			statusMessage: `This bag with ${label} does not exist.`,
		})
	}

	return emergencyBag
})
