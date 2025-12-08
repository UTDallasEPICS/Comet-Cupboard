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

    //Delete (archive) an existing source with the given name:
    const sourceToBeDeleted = await event.context.prisma.source.findUnique({
        where: {
            name: source,
            archived: false,
        },
    })
    if (!sourceToBeDeleted) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find source" })
	}
    const deletedSource = await event.context.prisma.source.update({
        where: {
            name: source,
            archived: false,
        },
        data: {
            archived: true,
        },
    })
    return deletedSource
})
