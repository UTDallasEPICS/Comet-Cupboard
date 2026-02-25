import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const itemCountChanges = await prisma.itemCountChange.findMany({
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
