import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const sessionToken = parseCookies(event)["better-auth.session-token"]
	const userID = event.context.userSession.userID
	const publicCode = event.context.userSession.publicCode

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

		if (sessionToken) {
			try {
				await tx.authSession.delete({
					where: { token: sessionToken },
				})
			} catch (error) {}
		}

		await tx.userSession.delete({
			where: { userID },
		})
	})

	const NODE_ENV = useRuntimeConfig(event).public.NODE_ENV

	setCookie(event, "better-auth.session-token", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: NODE_ENV === "prod",
		path: "/",
		maxAge: 0,
	})

	return sendRedirect(event, "/", 302)
})
