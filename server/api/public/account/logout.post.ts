import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const userID = event.context.userSession.userID
	const publicCode = event.context.userSession.publicCode

	const transactionResult = await prisma.$transaction(async (tx) => {
		try {
			const deletedQueueEntry = await tx.queueEntry.delete({
				where: {
					publicCode: publicCode,
				},
			})
			publishEvent(
				createEvent("queue.entryRemoved", {
					position: deletedQueueEntry.position,
					publicCode: deletedQueueEntry.publicCode,
					publicIcon: "", // don't want to join on UserSession here
				})
			)
		} catch (error) {}

		try {
			const deletedCartSession = await tx.cart.delete({
				where: {
					publicCode: publicCode,
				},
			})

			publishEvent(
				createEvent("cartSession.removed", {
					publicCode: publicCode,
				})
			)
		} catch (error) {}

		await tx.userSession.delete({
			where: {
				userID: userID,
			},
		})
		setCookie(event, "userID", "")
		return "Logout successful"
	})

	return transactionResult
})
