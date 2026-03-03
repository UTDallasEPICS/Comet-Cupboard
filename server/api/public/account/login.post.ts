import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { netID } = result.data
	// find user with NetID
	const user = await prisma.user.findUnique({
		where: {
			netID: netID,
		},
		include: { Volunteer: true, Admin: true },
	})
	if (!user) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: `Failed to find user ${netID}` })
	}
	setCookie(event, "netID", netID)
	return `Successful login for user ${netID}`
})
