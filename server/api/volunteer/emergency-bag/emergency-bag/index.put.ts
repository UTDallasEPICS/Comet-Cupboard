import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const generateRandomLabel = () => Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")

const schema = z
	.object({
		emergencyBagID: z.string(),
		expiryDate: z.coerce.date(),
		labels: z.array(z.string().trim().min(1)).default([]),
		items: z
			.array(
				z.object({
					specificItemID: z.string(),
					existingItemCountsToDecrease: z.int().nonnegative(),
					newItemCountsToAdd: z.int().nonnegative(),
				})
			)
			.min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { emergencyBagID, expiryDate, labels, items } = await validateBody(event, schema)

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

					emergencyBagItems: {
						createMany: {
							data: items.map((item) => ({
								specificItemID: item.specificItemID,
								count: item.newItemCountsToAdd,
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

			const existingItemsMap = new Map(existingBag.emergencyBagItems.map((item) => [item.specificItemID, item.count]))

			const updatedItems = items.map((item) => {
				const existingCount = existingItemsMap.get(item.specificItemID) ?? 0

				if (item.existingItemCountsToDecrease > existingCount) {
					throw createError({
						statusCode: 400,
						statusMessage:
							`Cannot remove ${item.existingItemCountsToDecrease} ` +
							`item(s) from ${item.specificItemID}; ` +
							`only ${existingCount} currently exist in the bag.`,
					})
				}

				return {
					specificItemID: item.specificItemID,
					count: existingCount - item.existingItemCountsToDecrease + item.newItemCountsToAdd,
				}
			})

			const updatedBag = await tx.emergencyBag.update({
				where: {
					emergencyBagID,
				},
				data: {
					expiryDate,
					emergencyBagItems: {
						upsert: updatedItems.map((item) => ({
							where: {
								emergencyBagItemID: {
									specificItemID: item.specificItemID,
									emergencyBagID,
								},
							},
							update: {
								count: item.count,
							},
							create: {
								specificItemID: item.specificItemID,
								count: item.count,
							},
						})),
					},
					emergencyBagLabels: {
						set: labels.map((emergencyBagLabelName) => ({
							emergencyBagLabelName,
						})),
					},
				},
			})

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
