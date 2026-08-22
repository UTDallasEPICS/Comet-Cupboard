import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		specificItemID: z.string(),
		incrementChange: z.number().int().min(-1).max(1),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { specificItemID, incrementChange } = await validateBody(event, schema)
	const publicCode = event.context.userSession.publicCode

	if (incrementChange === 0) {
		return "No changes made"
	}

	await prisma.$transaction(async (tx) => {
		const cart = await tx.cart.findUnique({
			where: { publicCode: publicCode },
			select: { publicCode: true, pending: true },
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
				where: { cartItemID: { publicCode: cart.publicCode, specificItemID } },
				update: { count: { increment: incrementChange } },
				create: { publicCode: cart.publicCode, specificItemID, count: incrementChange },
			})
		} else {
			try {
				const updatedItem = await tx.cartItem.update({
					where: { cartItemID: { publicCode: cart.publicCode, specificItemID } },
					data: { count: { increment: incrementChange } },
				})

				if (updatedItem.count <= 0) {
					await tx.cartItem.delete({
						where: { cartItemID: { publicCode: cart.publicCode, specificItemID } },
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
