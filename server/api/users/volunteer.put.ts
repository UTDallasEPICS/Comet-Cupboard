import { z } from "zod"
import { Prisma } from "@prisma/client"

const schema = z.object({
	netID: z.string().length(9),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid netID" })
	}

	const { netID } = result.data
	try {
		const volunteer = await event.context.prisma.volunteer.create({
			data: {
				netID: netID,
			},
		})
		return volunteer
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2003":
					throw createError({ statusCode: 404, statusMessage: `User ${netID} not found` })
				case "P2002":
					throw createError({ statusCode: 404, statusMessage: `User ${netID} is already a Volunteer` })
			}
		}
		throw createError({ statusCode: 404, statusMessage: "Error adding Volunteer" })
	}
})
