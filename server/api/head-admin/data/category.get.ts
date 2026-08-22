import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const items = await prisma.item.findMany({
		orderBy: {
			itemName: "asc",
		},
		include: {
			category: true,
			specificItems: true,
		},
	})

	const rows = items.map((row) => {
		return {
			itemCategory: row.category.categoryName,
			itemName: row.itemName,
			itemQuantity: row.specificItems.reduce((total, specificItem) => total + Number(specificItem.quantity), 0),
		}
	})

	const categoryTotal: Record<string, Record<string, number>> = {}

	for (const { itemCategory, itemName, itemQuantity } of rows) {
		if (!(itemCategory in categoryTotal)) {
			categoryTotal[itemCategory] = {}
		}

		categoryTotal[itemCategory]![itemName] = itemQuantity
	}

	return categoryTotal
})
