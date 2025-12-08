import { z } from "zod"

const schema = z.object({
	source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid input" })
	}

	const { source } = result.data

	const archivedSource = await event.context.prisma.source.findUnique({
		where: {
			name: source,
			archived: true,
		},
	})
	if (archivedSource) {
		const newSource = await event.context.prisma.source.update({
			where: {
				name: source,
				archived: true,
			},
			data: {
				archived: false,
			},
		})
		return newSource
	}
	
	try {
		const newSource = await event.context.prisma.source.create({
			data: {
				name: source,
			},
		})
		return newSource
	} catch (error) {
		throw createError({ statusCode: 404, statusMessage: "Error adding Source" })
	}
})
