import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../../prisma/generated/prisma/client"
import { intakeSessionSchema } from "#shared/utils/formSchemas"

const schema = intakeSessionSchema.extend({
	intakeDate: z.coerce.date(),
	sourceMetadata: z.json().optional(),
})

export default defineSafeHandler(async (event) => {
	const { notes, intakeDate, sourceID, inventoryIntakeSessionName, sourceMetadata } = await validateBody(event, schema)

	const sourceName = await prisma.source
		.findUnique({
			where: {
				sourceID,
			},
			select: {
				sourceName: true,
			},
		})
		.then((source) => source?.sourceName ?? "")

	return await prisma.$transaction(async (tx) => {
		const result = await tx.inventoryIntakeSession.create({
			data: {
				inventoryIntakeSessionName,
				notes,
				intakeDate,
				sourceID,
				sourceName,
				...(sourceMetadata !== undefined
					? {
							sourceMetadata: sourceMetadata as Prisma.InputJsonValue,
						}
					: {}),
			},
		})
		await tx.auditLog.create({
			data: {
				action: "INVENTORY_INTAKE_SESSION_CREATED",
				message: `Inventory intake session created: ${result.inventoryIntakeSessionName}`,
				userID: event.context.userSession.userID,
			},
		})
		return result
	})
})
