export default defineEventHandler(async (event) => {
	const orderItems = await event.context.prisma.order.findMany({
		include: {
			OrderItems: {
				select: {
					count: true,
					Item: {
						select: {
							itemID: true,
							name: true,
							categoryName: true,
						},
					},
				},
			},
		},
	})
	return orderItems
})
