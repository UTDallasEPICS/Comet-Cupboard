import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		pending: z.string().default("false"),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { pending } = validateQuery(event, schema)

	const carts = await prisma.cart.findMany({
		where: {
			pending: pending === "true",
		},
		orderBy: {
			createdAt: "asc",
		},
		include: {
			userSession: {
				select: {
					publicCode: true,
					publicIcon: true,
				},
			},
		},
	})

	const formattedCarts = carts.map((cart) => ({
		publicCode: cart.userSession.publicCode,
		publicIcon: cart.userSession.publicIcon,
		pending: cart.pending,
		createdAt: cart.createdAt,
	}))
	return formattedCarts
})
