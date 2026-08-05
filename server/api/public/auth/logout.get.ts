import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const userID = event.context.userSession.userID
	const publicCode = event.context.userSession.publicCode

	await clearUserSession(event)

	await prisma.$transaction(async (tx) => {
		try {
			await tx.queueEntry.delete({
				where: { publicCode },
			})
		} catch (error) {}

		try {
			await tx.cart.delete({
				where: { publicCode },
			})
		} catch (error) {}

		await tx.userSession.delete({
			where: { userID },
		})
	})

	return sendRedirect(event, "/", 302)
})
