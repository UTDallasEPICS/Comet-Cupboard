import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		bagIDs: z.array(z.string()).min(1),
		location: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { bagIDs, location } = await validateBody(event, schema)

	const moveBag = await prisma.emergencyBag.updateMany({
		where: {
			label: { in: bagIDs },
		},
		data: {
			locationName: location,
		},
	})

	return moveBag
})
