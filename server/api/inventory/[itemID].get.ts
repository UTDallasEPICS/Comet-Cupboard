import { z } from "zod"

const schema = z.object({
    itemID: z.string()
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
    const params = await getValidatedRouterParams(event, (param) => validateSchema.safeParse(param))
    console.log(params)
	if (!params.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
    const { itemID } = params.data
    return await event.context.prisma.item.findUnique({
        where: {
            itemID: itemID
        }
    })
})
