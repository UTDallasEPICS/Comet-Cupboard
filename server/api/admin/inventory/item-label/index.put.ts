import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { itemLabelSchema } from "#shared/utils/formSchemas"

const schema = itemLabelSchema.extend({ itemLabelID: z.string().optional() }).strict()

export default defineSafeHandler(async (event) => {
	const { itemLabelID, itemLabelName, archived } = await validateBody(event, schema)

	return await prisma.$transaction(async (tx) => {
		if (!itemLabelID) {
			const itemLabel = await tx.itemLabel.create({ data: { itemLabelName, archived } })
			await tx.auditLog.create({
				data: { action: "ITEM_LABEL_CREATED", message: `Item label created: ${itemLabel.itemLabelName}`, userID: event.context.userSession.userID },
			})
			return itemLabel
		}

		const itemLabel = await tx.itemLabel.update({ where: { itemLabelID }, data: { itemLabelName, archived } })
		await tx.auditLog.create({
			data: { action: "ITEM_LABEL_EDITED", message: `Item label updated: ${itemLabel.itemLabelName}`, userID: event.context.userSession.userID },
		})
		return itemLabel
	})
})