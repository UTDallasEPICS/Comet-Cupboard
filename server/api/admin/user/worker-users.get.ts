import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

export default defineEventHandler(async (event) => {
	const users = await prisma.user.findMany({
		where: {
			role: RoleType.VOLUNTEER || RoleType.ADMIN || RoleType.HEAD_ADMIN,
		},
		select: {
			netID: true,
			role: true,
		},
	})

	if (!users) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No worker users found" })
	}

	return users
})
