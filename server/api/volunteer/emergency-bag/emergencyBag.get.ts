import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z
	.object({
		bagID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { bagID } = validateQuery(event, schema)

	const emBag = await prisma.emergencyBag.findUnique({
		where: {
			bagID: bagID,
		},
		include: {
			EmergencyBagItems: { include: { Item: true } },
		},
	})

	return emBag
})
