import { prisma } from "#server/utils/db"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const requests = await prisma.roleRequest.findMany({
		where: {
			role: RoleType.VOLUNTEER,
		},
		select: {
			userID: true,
			User: {
				select: {
					netID: true,
					role: true,
				},
			},
		},
	})

	return requests
})
