import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
    source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
    if (!result.success) {
        throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid input" })
    }

    const { source } = result.data

    //Delete (archive) an existing source with the given name:
    const sourceToBeDeleted = await prisma.source.findUnique({
        where: {
            name: source,
            archived: false,
        },
    })
    if (!sourceToBeDeleted) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to find source" })
	}
    const deletedSource = await prisma.source.update({
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
