import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateBody } from "#server/utils/validation"
import { publishEvent } from "#server/utils/eventBus"
import { createEvent } from "#server/utils/eventsFactory"

const schema = z.object({
	inventoryIntakeSessionID: z.string(),
	specificItemID: z.string(),
	incrementChange: z.int(),
})

export default defineSafeHandler(async (event) => {
	const { inventoryIntakeSessionID, specificItemID, incrementChange } = await validateBody(event, schema)
	return await prisma.$transaction(async (prisma) => {
		const change = await prisma.inventoryIntakeSessionItemChange.create({
			data: { inventoryIntakeSessionID, specificItemID, amountChanged: incrementChange },
			include: {
				specificItem: true,
			},
		})
		publishEvent(
			createEvent("inventoryIntakeSession.specificItemAmountChange", {
				inventoryIntakeSessionID,
				specificItemID,
				productName: change.specificItem.productName,
				imgName: change.specificItem.imgName,
				amountChanged: change.amountChanged,
				inventoryIntakeSessionItemChangeID: change.InventoryIntakeSessionItemChangeID,
			})
		)
		return change
	})
})
