import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID } = validateQuery(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		await tx.deal.delete({
			where: {
				itemID: itemID,
			},
		})
		await tx.auditLog.create({
			data: {
				action: "ITEM_EDITED",
				message: `Deal deleted for item: ${itemID}`,
				userID: event.context.userSession.userID,
			},
		})

		return "Successfully deleted deal"
	})

    return transactionResult
})
