import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		itemID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID } = await validateBody(event, schema)
	const netID = event.context.user.netID

	try {
		await prisma.cartItem.delete({
			where: {
				cartItemID: {
					cartID: netID,
					itemID: itemID,
				},
				Cart: {
					pending: false,
				},
			},
		})
		return "Successfully deleted item from cart"
	} catch (error: unknown) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not in cart" })
		}
		throw error
	}
})
