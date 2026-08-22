import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		bagIDs: z.array(z.string().min(1)).min(1),
		locationID: z.string(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { bagIDs, locationID } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const movedBags = await tx.emergencyBag.updateMany({
			where: {
				emergencyBagID: { in: bagIDs },
			},
			data: {
				locationID,
			},
		})
		await tx.auditLog.create({
			data: {
				action: "EMERGENCY_BAG_EDITED",
				message: `Moved ${movedBags.count} emergency bag(s) to location ${locationID}.`,
				userID: event.context.userSession.userID,
			},
		})
		return movedBags
	})

	return transactionResult
})
