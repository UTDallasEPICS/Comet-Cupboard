//import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

function toCategoryLabels(category: string): string[] {
	switch (category) {
		case "VEGETARIAN":
			return ["Vegetarian"]
		case "PEANUT_BUTTER":
			return ["Peanut Butter"]
		case "VEGETARIAN_AND_PEANUT_BUTTER":
			return ["Vegetarian", "Peanut Butter"]
		default:
			return []
	}
}

export default defineSafeHandler(async (event) => {
	const emBags = await prisma.emergencyBag.findMany({
		include: {
			EmergencyBagItems: {
				include: {
					Item: true,
				},
			},
		},
	})

	const rows = emBags.map((row) => ({
		bagID: row.label,
		location: row.locationName,
        label: toCategoryLabels(row.bagCategory),
		expirationDate: row.expiryDate,
        privacy: row.privacy,
		items: row.EmergencyBagItems.map((bagItem) => ({
			itemID: bagItem.itemID,
			name: bagItem.Item.name,
			count: bagItem.count,
			imgName: bagItem.Item.imgName,
		})),
	}))

	return rows
})
