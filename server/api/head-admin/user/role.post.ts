import { z } from "zod"
import { prisma } from "#server/utils/db"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z.object({
	userID: z.string(),
	newRole: z.enum([RoleType.STUDENT, RoleType.VOLUNTEER, RoleType.ADMIN, RoleType.HEAD_ADMIN]),
})

export default defineSafeHandler(async (event) => {
	const { userID, newRole } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const user = await tx.user.findUnique({
			where: {
				userID: userID,
			},
		})

		if (!user) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User not found" })
		}

		if (user.role === RoleType.HEAD_ADMIN && newRole !== RoleType.HEAD_ADMIN) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Cannot demote HEAD_ADMIN to a lower role" })
		}

		await tx.user.update({
			where: {
				userID: userID,
			},
			data: {
				role: newRole,
			},
		})

		return "User role updated successfully"
	})

	return transactionResult
})
