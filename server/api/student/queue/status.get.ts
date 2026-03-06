import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const existingEntry = await prisma.queueEntry.findUnique({
		where: { netID: netID },
	})
	if (!existingEntry) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User is not in the queue" })
	}

	return existingEntry
})
