import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
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
