import { z } from "zod"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}

	const { netID } = result.data

	try {
		await event.context.prisma.volunteer.delete({
			where: { netID: netID },
		})
	} catch (error) {
		throw createError({ statusCode: 400, statusMessage: "Failed to delete volunteer" })
	}
})
