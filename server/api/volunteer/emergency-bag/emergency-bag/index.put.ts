import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { AccessPermission } from "#shared/utils/permissions"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const generateRandomLabel = () => Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")

const schema = z
	.object({
		emergencyBagID: z.string().optional(),
		expiryDate: z.coerce.date(),
		labels: z.array(z.string().trim().min(1)).default([]),
		private: z.boolean().default(false),
		bagDescription: z.string().trim().default(""),
		items: z
			.array(
				z.object({
					specificItemID: z.string(),
					count: z.int().positive(),
				})
			)
			.min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { emergencyBagID, expiryDate, labels, private: isPrivate, bagDescription, items } = await validateBody(event, schema)
	if (isPrivate && !event.context.permissions[AccessPermission.ADMIN]) {
		throw createError({ statusCode: 403, statusMessage: "Only administrators can create or edit private emergency bags." })
	}

	// Prevent multiple entries for the same specific item.
	const uniqueItemIDs = new Set(items.map((item) => item.specificItemID))

	if (uniqueItemIDs.size !== items.length) {
		throw createError({
			statusCode: 400,
			statusMessage: "Each specific item can only appear once in an emergency bag update.",
		})
	}

	return await prisma.$transaction(async (tx) => {
		if (!emergencyBagID) {
			const specificItems = await tx.specificItem.findMany({ where: { specificItemID: { in: items.map((item) => item.specificItemID) } } })
			for (const item of items) {
				const specificItem = specificItems.find((candidate) => candidate.specificItemID === item.specificItemID)
				if (!specificItem || specificItem.quantity < item.count) {
					throw createError({ statusCode: 400, statusMessage: "Insufficient inventory to create this emergency bag." })
				}
			}
			let newBagLabel = generateRandomLabel()

			while (
				await tx.emergencyBag.findUnique({
					where: {
						label: newBagLabel,
					},
				})
			) {
				newBagLabel = generateRandomLabel()
			}

			const newBag = await tx.emergencyBag.create({
				data: {
					label: newBagLabel,
					expiryDate,
					private: isPrivate,
					bagDescription: isPrivate ? bagDescription : "",

					emergencyBagItems: {
						createMany: {
							data: items.map((item) => ({
								specificItemID: item.specificItemID,
								count: item.count,
							})),
						},
					},

					emergencyBagLabels: {
						connect: labels.map((emergencyBagLabelName) => ({
							emergencyBagLabelName,
						})),
					},
				},
			})
			for (const item of items) {
				await tx.specificItem.update({ where: { specificItemID: item.specificItemID }, data: { quantity: { decrement: item.count } } })
			}

			await tx.auditLog.create({
				data: {
					action: "EMERGENCY_BAG_CREATED",
					message: `Emergency bag ${newBag.label} with labels ${
						labels.length > 0 ? labels.join(", ") : "none"
					} created with ${items.length} item(s).`,
					userID: event.context.userSession.userID,
				},
			})

			return newBag
		} else {
			const existingBag = await tx.emergencyBag.findUnique({
				where: {
					emergencyBagID,
				},
				include: {
					emergencyBagItems: true,
				},
			})

			if (!existingBag) {
				throw createError({
					statusCode: 404,
					statusMessage: "Emergency bag not found.",
				})
			}
			if (existingBag.private && !event.context.permissions[AccessPermission.ADMIN]) {
				throw createError({ statusCode: 403, statusMessage: "Only administrators can edit private emergency bags." })
			}
			const existingItemsMap = new Map(existingBag.emergencyBagItems.map((item) => [item.specificItemID, item.count]))
			const requestedItemsMap = new Map(items.map((item) => [item.specificItemID, item.count]))
			const itemIDs = [...new Set([...existingItemsMap.keys(), ...requestedItemsMap.keys()])]
			const specificItems = await tx.specificItem.findMany({ where: { specificItemID: { in: itemIDs } } })
			for (const specificItemID of itemIDs) {
				const inventoryDelta = (requestedItemsMap.get(specificItemID) ?? 0) - (existingItemsMap.get(specificItemID) ?? 0)
				if (inventoryDelta <= 0) continue
				const specificItem = specificItems.find((candidate) => candidate.specificItemID === specificItemID)
				if (!specificItem || specificItem.quantity < inventoryDelta) {
					throw createError({ statusCode: 400, statusMessage: "Insufficient inventory to update this emergency bag." })
				}
			}

			const updatedBag = await tx.emergencyBag.update({
				where: {
					emergencyBagID,
				},
				data: {
					expiryDate,
					private: isPrivate,
					bagDescription: isPrivate ? bagDescription : "",
					emergencyBagItems: {
						deleteMany: {},
						createMany: { data: items },
					},
					emergencyBagLabels: {
						set: labels.map((emergencyBagLabelName) => ({
							emergencyBagLabelName,
						})),
					},
				},
			})
			for (const specificItemID of itemIDs) {
				const inventoryDelta = (requestedItemsMap.get(specificItemID) ?? 0) - (existingItemsMap.get(specificItemID) ?? 0)
				if (inventoryDelta !== 0) {
					await tx.specificItem.update({ where: { specificItemID }, data: { quantity: { decrement: inventoryDelta } } })
				}
			}

			await tx.auditLog.create({
				data: {
					action: "EMERGENCY_BAG_EDITED",
					message: `Emergency bag ${existingBag.label} updated with ${items.length} item(s).`,
					userID: event.context.userSession.userID,
				},
			})

			return updatedBag
		}
	})
})
