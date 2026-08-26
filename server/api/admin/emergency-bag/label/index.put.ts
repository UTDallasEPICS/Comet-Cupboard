import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { emergencyBagLabelSchema } from "#shared/utils/formSchemas"

const schema = emergencyBagLabelSchema.extend({ emergencyBagLabelID: z.string().optional() }).strict()

export default defineSafeHandler(async (event) => {
	const { emergencyBagLabelID, emergencyBagLabelName, color, archived } = await validateBody(event, schema)

	return await prisma.$transaction(async (tx) => {
		if (!emergencyBagLabelID) {
			const emergencyBagLabel = await tx.emergencyBagLabel.create({ data: { emergencyBagLabelName, color, archived } })
			await tx.auditLog.create({
				data: {
					action: "EMERGENCY_BAG_LABEL_CREATED",
					message: `Emergency bag label created: ${emergencyBagLabel.emergencyBagLabelName}`,
					userID: event.context.userSession.userID,
				},
			})
			return emergencyBagLabel
		}

		const emergencyBagLabel = await tx.emergencyBagLabel.update({
			where: { emergencyBagLabelID },
			data: { emergencyBagLabelName, color, archived },
		})
		await tx.auditLog.create({
			data: {
				action: "EMERGENCY_BAG_LABEL_EDITED",
				message: `Emergency bag label updated: ${emergencyBagLabel.emergencyBagLabelName}`,
				userID: event.context.userSession.userID,
			},
		})
		return emergencyBagLabel
	})
})