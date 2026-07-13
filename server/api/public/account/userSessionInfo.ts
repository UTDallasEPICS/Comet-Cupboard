import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const userID = event.context.userSession.userID

	const userSession = await prisma.userSession.findUnique({
		where: { userID: userID },
		select: {
			userID: true,
			publicCode: true,
			publicIcon: true,
		},
	})

	if (!userSession) {
		throw createError({ statusCode: 404, statusMessage: "User session not found" })
	}

	return userSession
})
