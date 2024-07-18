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
	if (event.context.user.Cart) {
		event.context.prisma.$transaction(async (tx) => {
            const item = await tx.item.findUnique({
                where: {
                    itemID: itemID
                }
            })

            if(!item) {
                throw new Error(`Not a valid itemID`)
            }
            if(item.quantity <= 0) {
                throw new Error(`Item out of stock`)
            }

			await tx.item.update({
				where: {
					itemID: itemID,
				},
				data: {
					quantity: { decrement: 1 },
				},
			})

            await tx.cartItem.upsert({
                where: {
                    cartItemID: {
                        cartID: event.context.user.Cart.cartID,
                        itemID: itemID,
                    },
                },
                update: {
                    count: { increment: 1 },
                },
                create: {
                    cartID: event.context.user.Cart.cartID,
                    itemID: itemID,
                    count: 1,
                },
            })
		})
	}
})
