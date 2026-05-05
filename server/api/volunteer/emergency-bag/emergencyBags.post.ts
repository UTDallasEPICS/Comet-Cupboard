import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"
import { generateRandomLabel } from "#server/utils/emBagLabelGenerator"

const schema = z
	.object({
		bagCategory: z.enum([
			"VEGETARIAN_AND_PEANUT_BUTTER",
			"VEGETARIAN_AND_NON_PEANUT_BUTTER",
			"NONVEGETARIAN_AND_PEANUT_BUTTER",
			"NONVEGETARIAN_AND_NON_PEANUT_BUTTER",
		]),
		expiryDate: z.string().datetime(),
		items: z.array(
			z.object({
				itemID: z.string(),
				count: z.number().int().min(1),
			})
		).min(1, "At least one item required"),
		isPrivate: z.boolean().optional().default(false),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { bagCategory, expiryDate, items, isPrivate } = await validateBody(event, schema)

	const label = generateRandomLabel()

	const newBag = await prisma.emergencyBag.create({
		data: {
			bagCategory,
			expiryDate: new Date(expiryDate),
			label,
			private: isPrivate,
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