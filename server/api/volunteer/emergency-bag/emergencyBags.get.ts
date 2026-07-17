//import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

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
		isVegetarian: row.isVegetarian,
		hasPeanutButter: row.hasPeanutButter,
		expirationDate: row.expiryDate,
		privacy: row.privacy,
		bagDescription: row.bagDescription,
		items: row.EmergencyBagItems.map((bagItem) => ({
			itemID: bagItem.itemID,
			name: bagItem.Item.name,
			count: bagItem.count,
			imgName: bagItem.Item.imgName,
		})),
	}))

	return rows
})
