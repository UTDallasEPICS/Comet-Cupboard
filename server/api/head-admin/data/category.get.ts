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

	const categoryTotal: Record<string, Record<string, { quantity: number; specificItems: Record<string, number> }>> = {}

	for (const item of items) {
		const category = item.category.categoryName

		if (!(category in categoryTotal)) {
			categoryTotal[category] = {}
		}

		const specificItems: Record<string, number> = {}
		for (const specificItem of item.specificItems) {
			specificItems[specificItem.productName] = Number(specificItem.quantity)
		}

		categoryTotal[category]![item.itemName] = {
			quantity: item.specificItems.reduce((total, specificItem) => total + Number(specificItem.quantity), 0),
			specificItems,
		}
	}

	return categoryTotal
})
