import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { generateRandomLabel } from "#server/utils/emBagLabelGenerator"

const schema = z
	.object({
		bagCategory: z.array(z.enum(["VEGETARIAN", "PEANUT_BUTTER"])),
		expiryDate: z.coerce.date(),
		privacy: z.enum(["PUBLIC", "PRIVATE"]),
		bagDescription: z.string().nullable().optional(),
		items: z.array(
			z.object({
				itemID: z.string(),
				count: z.number().int().min(1),
			})
		),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { bagCategory, expiryDate, privacy, bagDescription, items } = await validateBody(event, schema)

	const label = generateRandomLabel()

	const newBag = await prisma.emergencyBag.create({
		data: {
			isVegetarian: bagCategory.includes("VEGETARIAN"),
			hasPeanutButter: bagCategory.includes("PEANUT_BUTTER"),
			expiryDate: new Date(expiryDate),
			privacy: privacy,
			label,
			bagDescription,
			EmergencyBagItems: {
				createMany: {
					data: items.map((item) => ({
						itemID: item.itemID,
						count: item.count,
					})),
				},
			},
		},
		include: {
			EmergencyBagItems: true,
		},
	})

	for (const item of items) {
		const updateResult = await prisma.item.updateMany({
			where: {
				itemID: item.itemID,
				quantity: { gte: item.count },
			},
			data: {
				quantity: {
					decrement: item.count,
				},
			},
		})

		if (updateResult.count === 0) {
			throw createError({
				statusCode: 409,
				statusMessage: `Not enough "${item.itemID}" in stock`,
			})
		}
	}

	return newBag
})
