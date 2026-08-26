import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { AccessPermission } from "#shared/utils/permissions"

const schema = z
	.object({
		bagIDs: z.array(z.string().min(1)).min(1),
		locationID: z.string().nullable(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { bagIDs, locationID } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const privateBags = await tx.emergencyBag.count({ where: { emergencyBagID: { in: bagIDs }, private: true } })
		if (privateBags > 0 && !event.context.permissions[AccessPermission.ADMIN]) {
			throw createError({ statusCode: 403, statusMessage: "Only administrators can move private emergency bags." })
		}
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
				message: `Moved ${movedBags.count} emergency bag(s) to ${locationID ? `location ${locationID}` : "Unassigned"}.`,
				userID: event.context.userSession.userID,
			},
		})
		return movedBags
	})

	return transactionResult
})
