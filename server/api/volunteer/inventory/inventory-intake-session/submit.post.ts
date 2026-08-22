import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../../prisma/generated/prisma/client"
import { StatusCodes } from "http-status-codes"
import { publishEvent } from "#server/utils/eventBus"
import { createEvent } from "#server/utils/eventsFactory"

const schema = z.object({
	inventoryIntakeSessionID: z.string(),
})

export default defineSafeHandler(async (event) => {
	const { inventoryIntakeSessionID } = await validateBody(event, schema)

	return await prisma.$transaction(async (tx) => {
		// move all inventory intake session data to completed table
		const inventoryIntakeSession = await tx.inventoryIntakeSession.findUnique({
			where: {
				inventoryIntakeSessionID,
			},
			include: {
				inventoryIntakeSessionItemChanges: {
					include: {
						specificItem: true,
					},
				},
			},
		})

		if (!inventoryIntakeSession) {
			throw createError({
				statusCode: StatusCodes.NOT_FOUND,
				message: "Inventory intake session not found",
			})
		}

		const completedInventoryIntakeSession = await tx.completedInventoryIntakeSession.create({
			data: {
				inventoryIntakeSessionName: inventoryIntakeSession.inventoryIntakeSessionName,
				notes: inventoryIntakeSession.notes,
				intakeDate: inventoryIntakeSession.intakeDate,
				sourceID: inventoryIntakeSession.sourceID,
				sourceName: inventoryIntakeSession.sourceName,
				...(inventoryIntakeSession.sourceMetadata !== undefined
					? {
							sourceMetadata: inventoryIntakeSession.sourceMetadata as Prisma.InputJsonValue,
						}
					: {}),
			},
		})

		const aggregatedItemChanges = inventoryIntakeSession.inventoryIntakeSessionItemChanges.reduce(
			(acc, change) => {
				const specificItemID = change.specificItem.specificItemID
				if (!acc[specificItemID]) {
					acc[specificItemID] = {
						specificItemID,
						amountChanged: 0,
					}
				}
				acc[specificItemID].amountChanged += change.amountChanged
				return acc
			},
			{} as Record<string, { specificItemID: string; amountChanged: number }>
		)

		const completedInventoryIntakeSessionItems = await tx.completedInventoryIntakeSessionItem.createMany({
			data: Object.values(aggregatedItemChanges).map((itemChange) => ({
				completedInventoryIntakeSessionID: completedInventoryIntakeSession.completedInventoryIntakeSessionID,
				specificItemID: itemChange.specificItemID,
				amountChanged: itemChange.amountChanged,
			})),
		})

		await tx.auditLog.create({
			data: {
				action: "INVENTORY_INTAKE_SESSION_COMPLETED",
				message: `Inventory intake session completed: ${completedInventoryIntakeSession.inventoryIntakeSessionName}`,
				userID: event.context.userSession.userID,
			},
		})

		publishEvent(createEvent("inventoryIntakeSession.submitted", { inventoryIntakeSessionID: inventoryIntakeSessionID }))

		return "Inventory intake session completed successfully"
	})
})
