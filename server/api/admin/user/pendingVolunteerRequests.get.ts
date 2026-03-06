import { prisma } from "#server/utils/db"
import { RoleType, RequestStatus } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const requests = await prisma.roleRequest.findMany({
		where: {
			role: RoleType.VOLUNTEER,
			status: RequestStatus.PENDING,
		},
		select: {
			userID: true,
			status: true,
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
