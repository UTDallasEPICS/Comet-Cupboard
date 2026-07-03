import { prisma } from "#server/utils/db"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const requests = await prisma.roleRequest.findMany({
		where: {
			role: RoleType.VOLUNTEER,
		},
		include: {
			UserSession: {
				select: {
					publicCode: true,
					publicIcon: true,
				},
			},
		}
	})

	const formattedRequests = requests.map((request) => ({
		publicCode: request.UserSession.publicCode,
		publicIcon: request.UserSession.publicIcon,
	}))

	return formattedRequests
})
