import { z } from "zod"

const schema = z.object({
    source: z.string(),
    fields: z.array(z.object({ name: z.string() })),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
    if (!result.success) {
        throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
    }
    const { source, fields } = result.data

    await event.context.prisma.source.findUnique({
        where: {
            name: source,
        },
    })

    await event.context.prisma.field.createMany({
        data: fields.map((field) => ({
            name: field.name,
            sourceName: source,
        })),
    })

    await event.context.prisma.source.findUnique({
        where: { name: source },
        include: { Fields: true },
    })

})
