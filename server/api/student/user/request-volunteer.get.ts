import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType, RequestStatus } from "../../../../prisma/generated/prisma/client"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	const existingRequest = await prisma.roleRequest.findUnique({
		where: {
			userID: netID,
			status: RequestStatus.PENDING,
			role: RoleType.VOLUNTEER,
		},
	})

	if (!existingRequest) {
		setResponseStatus(event, StatusCodes.NO_CONTENT)
		return
	}

	return existingRequest
})
