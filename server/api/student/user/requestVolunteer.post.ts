import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { RoleType, RequestStatus } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const transactionResult = await prisma.$transaction(async (tx) => {
		const user = await tx.user.findUnique({
			where: {
				netID: netID,
				role: RoleType.STUDENT,
			},
		})

		if (!user) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Student user not found" })
		}

		const existingRequest = await tx.roleRequest.findFirst({
			where: {
				userID: netID,
				status: RequestStatus.PENDING,
				role: RoleType.VOLUNTEER,
			},
		})

		if (existingRequest) {
			throw createError({ statusCode: StatusCodes.CONFLICT, statusMessage: "Volunteer request already pending" })
		}

		await tx.roleRequest.create({
			data: {
				userID: netID,
				role: RoleType.VOLUNTEER,
				status: RequestStatus.PENDING,
			},
		})

		return "Volunteer request submitted"
	})

	return transactionResult
})
