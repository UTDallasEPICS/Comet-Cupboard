import { z } from "zod"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid NetID" })
	}
	const { netID } = result.data
	const user = await event.context.prisma.user.findUnique({
		where: {
			netID: netID,
		},
	})
	if (!user) {
		throw createError({ statusCode: 401, statusMessage: "NetID not found" })
	}
	console.log("setting cooke" + netID)
	setCookie(event, "netID", netID)
})
