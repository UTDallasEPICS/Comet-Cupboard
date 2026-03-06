import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { Prisma, RoleType } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const userID = event.context.user.netID

	try {
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
				netID: userID,
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
