import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

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
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to find categories" })
	}
	return categories
})
