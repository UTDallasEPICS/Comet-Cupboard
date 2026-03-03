import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType, RequestStatus } from "../../../../prisma/generated/prisma/client"

export default defineEventHandler(async (event) => {
	const netID = event.context.user.netID

	const user = await prisma.user.findUnique({
		where: {
			netID: netID,
		},
	})

	if (!user) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User not found" })
	}
	if (user.role !== RoleType.STUDENT) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: "Unauthorized" })
	}
	const existingRequest = await prisma.roleRequest.findUnique({
		where: {
			userID: netID,
			status: RequestStatus.PENDING,
			role: RoleType.VOLUNTEER,
		},
	})

	if (existingRequest) {
		throw createError({ statusCode: StatusCodes.CONFLICT, statusMessage: "Volunteer request already pending" })
	}

	await prisma.roleRequest.create({
		data: {
			userID: netID,
			role: RoleType.VOLUNTEER,
			status: RequestStatus.PENDING,
		},
	})

    return "Volunteer request submitted"
})
