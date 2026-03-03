import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"
import { RoleType, RequestStatus } from "../../../../prisma/generated/prisma/client"

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

	const existingRequest = await prisma.roleRequest.findUnique({
		where: {
			userID: userID,
			status: RequestStatus.PENDING,
			role: RoleType.VOLUNTEER,
		},
	})

	if (!existingRequest) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No pending volunteer request found for this user" })
	}

	await prisma.roleRequest.update({
		where: {
			userID: userID,
			role: RoleType.VOLUNTEER,
			status: RequestStatus.PENDING,
		},
		data: {
			status: RequestStatus.APPROVED,
		},
	})

	await prisma.user.update({
		where: {
			netID: userID,
		},
		data: {
			role: RoleType.VOLUNTEER,
		},
	})

    return "Volunteer request approved"
})
