export default defineEventHandler(async (event) => {
	const itemCountChanges = await event.context.prisma.itemCountChange.findMany({
		include: {
			Item: {
				select: {
					itemID: true,
					name: true,
					categoryName: true,
				},
			},
		},
	})
	return itemCountChanges
})
