import { z } from "zod"

const schema = z.object({
	fieldID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { fieldID } = result.data

	await event.context.prisma.field.delete({
		where: {
			fieldID: fieldID,
		},
	})
})
