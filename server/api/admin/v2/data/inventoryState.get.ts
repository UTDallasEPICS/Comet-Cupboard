import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	categorySpecifier: z.string().optional(),
})

const validateSchema = schema.strict()

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { categorySpecifier } = result.data

	if (!categorySpecifier) {
		const categoryGroups = await prisma.item.groupBy({
			by: ["categoryName"],
			_sum: {
				quantity: true,
			},
		})
		const result = {}
		categoryGroups.forEach((g) => {
			result[g.categoryName] = g._sum.quantity ?? 0
		})

		return result
	} else {
		const rows = await prisma.item.findMany({
			where: {
				...(categorySpecifier ? { categoryName: categorySpecifier } : {}),
			},
		})
		const result = {}
		rows.forEach((item) => {
			result[item.itemID] = {
				name: item.name,
				quantity: item.quantity,
			}
		})
		return result
	}
})
