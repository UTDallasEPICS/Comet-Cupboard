import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineEventHandler(async (event) => {
	const userID = event.context.user.netID

	const user = await prisma.user.findUnique({
		where: {
			netID: userID,
			role: RoleType.HEAD_ADMIN,
		},
	})

	if (!user) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Head admin user not found" })
	}

	await prisma.user.update({
		where: {
			netID: userID,
		},
		data: {
			role: RoleType.ADMIN,
		},
	})

	return "User self-demoted to admin"
})
