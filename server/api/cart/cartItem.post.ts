import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
    if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID } = result.data
    if(event.context.user.Cart) {
        await event.context.prisma.cartItem.upsert({
            where: {
                cartItemID: {
                    cartID: event.context.user.Cart.cartID,
                    itemID: itemID
                }
            },
            update: {
                count: {increment: 1}
            },
            create: {
                cartID: event.context.user.Cart.cartID,
                itemID: itemID,
                count: 1
            }
        })
    }
})
