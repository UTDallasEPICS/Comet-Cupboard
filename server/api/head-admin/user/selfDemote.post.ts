import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { Prisma, RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const userID = event.context.userSession.userID
	const currentUserRole = event.context.userSession.User.role

	try {
		if (currentUserRole !== RoleType.HEAD_ADMIN) {
			throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: "Current user is not a head admin" })
		}

		const currentHeadAdmins = await prisma.user.findMany({
			where: {
				role: RoleType.HEAD_ADMIN,
			},
		})
		if (currentHeadAdmins.length <= 1) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Cannot demote self as the only head admin" })
		}

		await prisma.user.update({
			where: {
				userID: userID,
				role: RoleType.HEAD_ADMIN,
			},
			data: {
				role: RoleType.ADMIN,
			},
		})

		return "Successfully demoted to admin"
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Could not find head admin user to demote" })
		}
		throw error
	}
})
