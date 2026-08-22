import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
		itemName: z.string().min(1, "Name cannot be empty").max(100, "Name must be at most 100 characters"),
		categoryID: z.string(),
		archived: z.enum(["true", "false"]),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { itemName, categoryID, itemID, archived } = await validateFormData(event, schema)

	if (!itemID) {
		return await prisma.$transaction(async (tx) => {
			const newItem = await tx.item.create({
				data: {
					itemName,
					categoryID,
					archived: archived === "true",
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_CREATED",
					message: `Item created: ${newItem.itemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newItem
		})
	} else {
		const transactionResult = await prisma.$transaction(async (tx) => {
			const updatedItem = await tx.item.update({
				where: { itemID },
				data: {
					itemName,
					categoryID,
					archived: archived === "true",
				},
			})
			await tx.auditLog.create({
				data: {
					action: "ITEM_EDITED",
					message: `Item updated: ${updatedItem.itemID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedItem
		})

		return transactionResult
	}
})
