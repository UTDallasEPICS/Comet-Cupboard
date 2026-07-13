import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	const existingEntry = await prisma.queueEntry.findUnique({
		where: { publicCode: publicCode },
		include: {
			UserSession: {
				select: {
					publicIcon: true,
				},
			},
		},
	})
	if (!existingEntry) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User is not in the queue" })
	}
	const formattedEntry = {
		position: existingEntry.position,
		publicCode: existingEntry.publicCode,
		publicIcon: existingEntry.UserSession.publicIcon,
	}
	return formattedEntry
})
