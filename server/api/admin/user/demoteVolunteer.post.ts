import { z } from "zod"
import { prisma } from "#server/utils/db"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z.object({
	userID: z.string(),
})

export default defineSafeHandler(async (event) => {
	const { userID } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const user = await tx.user.findUnique({ where: { userID: userID, role: RoleType.VOLUNTEER } })

		if (!user) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Volunteer user not found" })
		}

		await tx.user.update({
			where: {
				userID: userID,
			},
			data: {
				role: RoleType.STUDENT,
			},
		})

		return "Volunteer demoted to student"
	})

	return transactionResult
})
