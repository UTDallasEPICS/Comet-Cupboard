import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	// retrieve the list of categories from the db
	const categories = await prisma.category.findMany({
		select: {
			name: true,
		},
		orderBy: {
			name: "asc",
		},
	})
	if (!categories) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find categories" })
	}
	return categories
})
