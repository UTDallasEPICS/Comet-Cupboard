import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { validateBody } from "#server/utils/validation"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const { netID } = await validateBody(event, validateSchema)

	const user = await prisma.user.findUnique({
		where: {
			netID: netID,
		},
	})
	if (!user) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User not found" })
	}

	setCookie(event, "netID", netID)
	return `Successful login for user ${netID}`
})
