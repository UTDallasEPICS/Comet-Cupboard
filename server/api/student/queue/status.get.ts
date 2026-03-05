import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID
	const existingEntry = await prisma.queueEntry.findUnique({
		where: { netID },
	})
	if (!existingEntry) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `User with netID ${netID} is not in the queue` })
	}

	return existingEntry
})
