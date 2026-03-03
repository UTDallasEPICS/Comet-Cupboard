import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z.object({
	userID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}

	const { userID } = result.data

	const user = await prisma.user.findUnique({
		where: {
			netID: userID,
			role: RoleType.STUDENT || RoleType.VOLUNTEER,
		},
	})

	if (!user) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User not found" })
	}

	await prisma.user.update({
		where: {
			netID: userID,
		},
		data: {
			role: RoleType.ADMIN,
		},
	})

    return "User promoted to admin"
})
