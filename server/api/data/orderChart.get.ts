export default defineEventHandler(async (event) => {
	const orderItems = await event.context.prisma.orderItem.findMany({
		include: {
			Order: {
				select: {
					date: true,
				},
			},
		},
	})

	if (!orderItems || orderItems.length === 0) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find data" })
	}

	const groupedData = orderItems.reduce(
		(acc: { [x: string]: any }, item: { Order: { date: { toISOString: () => string } }; count: any }) => {
			const dateKey = item.Order.date.toISOString().split("T")[0]
			acc[dateKey] = (acc[dateKey] || 0) + item.count
			return acc
		},
		{} as Record<string, number>
	)

	const result = Object.entries(groupedData).map(([date, totalItems]) => ({
		date,
		totalItems,
	}))

	return result
})
