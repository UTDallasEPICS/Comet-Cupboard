import { AccessLevel } from "~/permissions"
import { z } from "zod"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { netID } = result.data
	// find user with NetID
	const user = await event.context.prisma.user.findUnique({
		where: {
			netID: netID,
		},
		include: { Volunteer: true, Admin: true }
	})
	if (!user) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find user with netID" })
	}
	setCookie(event, "netID", netID)
	// sets cookie for purpose of frontend route guards
	setCookie(event, "accessLevel", AccessLevel.PUBLIC)
	if(user) {
		setCookie(event, "accessLevel", AccessLevel.STUDENT)
	}
	if(user.Volunteer) {
		setCookie(event, "accessLevel", AccessLevel.VOLUNTEER)
	}
	if(user.Admin) {
		setCookie(event, "accessLevel", AccessLevel.ADMIN)
	}
})
