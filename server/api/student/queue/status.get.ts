import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID
	const existingEntry = await prisma.queueEntry.findUnique({
		where: { netID },
	})
	if (!existingEntry) {
		throw createError({ statusCode: 400, statusMessage: `User with netID ${netID} is not in the queue` })
	}

	return existingEntry
})
