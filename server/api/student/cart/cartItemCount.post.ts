import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		itemID: z.string(),
		incrementChange: z.number().int().min(-1).max(1),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID, incrementChange } = await validateBody(event, schema)
	const netID = event.context.user.netID

	if (incrementChange === 0) {
		return "No changes made"
	}

	await prisma.$transaction(async (tx) => {
		const cart = await tx.cart.findUnique({
			where: { cartID: netID },
			select: { cartID: true, pending: true },
		})

		if (!cart) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart not found" })
		}

		if (cart.pending) {
			throw createError({
				statusCode: StatusCodes.CONFLICT,
				statusMessage: "Cart is pending verification",
			})
		}

		if (incrementChange > 0) {
			return await tx.cartItem.upsert({
				where: { cartItemID: { cartID: cart.cartID, itemID: itemID } },
				update: { count: { increment: incrementChange } },
				create: { cartID: cart.cartID, itemID: itemID, count: incrementChange },
			})
		} else {
			try {
				const updatedItem = await tx.cartItem.update({
					where: { cartItemID: { cartID: cart.cartID, itemID: itemID } },
					data: { count: { increment: incrementChange } },
				})

				if (updatedItem.count <= 0) {
					await tx.cartItem.delete({
						where: { cartItemID: { cartID: cart.cartID, itemID: itemID } },
					})
					return null
				}

				return updatedItem
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not in cart" })
				}
				throw error
			}
		}
	})

	return "Successfully edited cartItem"
})
