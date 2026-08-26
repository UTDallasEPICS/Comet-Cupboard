import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const queue = await prisma.queueEntry.findMany({
		orderBy: { position: "asc" },
		select: {
			position: true,
			publicCode: true,
			queuePingSentAt: true,
			queuePingAcknowledgedAt: true,
			queuePingAcknowledgementMessage: true,
			userSession: {
				select: {
					publicIcon: true,
				},
			},
		},
	})
	const formattedQueue = queue.map((entry) => ({
		position: entry.position,
		publicCode: entry.publicCode,
		publicIcon: entry.userSession.publicIcon,
		queuePingSentAt: entry.queuePingSentAt,
		queuePingAcknowledgedAt: entry.queuePingAcknowledgedAt,
		queuePingAcknowledgementMessage: entry.queuePingAcknowledgementMessage,
	}))

	return formattedQueue
})
