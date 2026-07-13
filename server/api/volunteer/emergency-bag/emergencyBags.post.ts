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
		items: z.array(
			z.object({
				itemID: z.string(),
				count: z.number().int().min(1),
			})
		),
	})
	.strict()
	.required()

function toBagCategory(selected: string[]): "NEITHER" | "VEGETARIAN" | "PEANUT_BUTTER" | "VEGETARIAN_AND_PEANUT_BUTTER" {
	const isVeg = selected.includes("VEGETARIAN")
	const isPB = selected.includes("PEANUT_BUTTER")

	if (isVeg && isPB) return "VEGETARIAN_AND_PEANUT_BUTTER"
	if (isVeg) return "VEGETARIAN"
	if (isPB) return "PEANUT_BUTTER"
	return "NEITHER"
}

export default defineSafeHandler(async (event) => {
	const { bagCategory, expiryDate, privacy, items } = await validateBody(event, schema)

	const label = generateRandomLabel()

	const newBag = await prisma.emergencyBag.create({
		data: {
			bagCategory: toBagCategory(bagCategory),
			expiryDate: new Date(expiryDate),
			privacy: privacy,
			label,
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
		await prisma.item.update({
			where: { itemID: item.itemID },
			data: {
				quantity: {
					decrement: item.count,
				},
			},
		})
	}

	return newBag
})
