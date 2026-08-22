import { prisma } from "#server/utils/db"

export default defineSafeHandler(async () => {
	const users = await prisma.user.findMany({
		select: {
			userID: true,
			displayName: true,
			role: true,
		},
	})

	return users
})
