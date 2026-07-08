import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const items = await prisma.item.findMany({
		where: {
			archived: false
		},
		select: {
			itemID: true,
			name: true,
			imgName: true,
			quantity: true,
		},
	})

	const rows = items.map((row) => {
		return {
			itemID: row.itemID,
			name: row.name,
			imgName: row.imgName,
			quantityAvailable: row.quantity,
		}
	})
	console.log(rows)
	return rows
})
