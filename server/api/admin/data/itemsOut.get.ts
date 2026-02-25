import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const orderItems = await prisma.order.findMany({
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
