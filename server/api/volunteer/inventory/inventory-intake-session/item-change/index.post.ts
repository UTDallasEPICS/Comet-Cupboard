import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateBody } from "#server/utils/validation"

const schema = z.object({
	inventoryIntakeSessionID: z.string(),
	specificItemID: z.string(),
	amountChanged: z.int(),
})

export default defineSafeHandler(async (event) => {
	const { inventoryIntakeSessionID, specificItemID, amountChanged } = await validateBody(event, schema)
	return await prisma.inventoryIntakeSessionItemChange.create({
		data: {
			inventoryIntakeSessionID,
			specificItemID,
			amountChanged,
		},
	})
})
