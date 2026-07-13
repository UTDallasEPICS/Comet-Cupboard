import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode
	const currentUserRole = event.context.userSession.User.role

	const transactionResult = await prisma.$transaction(async (tx) => {
		if (currentUserRole !== RoleType.STUDENT) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Student user not found" })
		}

		const existingRequest = await tx.roleRequest.findFirst({
			where: {
				publicCode: publicCode,
				role: RoleType.VOLUNTEER,
			},
		})

		if (existingRequest) {
			throw createError({ statusCode: StatusCodes.CONFLICT, statusMessage: "Volunteer request already pending" })
		}

		await tx.roleRequest.create({
			data: {
				publicCode: publicCode,
				role: RoleType.VOLUNTEER,
			},
		})

		return "Volunteer request submitted"
	})

	return transactionResult
})
