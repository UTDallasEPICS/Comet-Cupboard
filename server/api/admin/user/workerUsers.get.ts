import { prisma } from "#server/utils/db"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async () => {
	const users = await prisma.user.findMany({
		where: {
			role: {
				in: [RoleType.VOLUNTEER, RoleType.ADMIN, RoleType.HEAD_ADMIN],
			},
		},
		select: {
			userID: true,
			role: true,
		},
	})

	return users
})
