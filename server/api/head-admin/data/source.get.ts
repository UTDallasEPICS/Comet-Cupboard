import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"

const schema = z.object({
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
})

const validateSchema = schema.strict()

export default defineSafeHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { startDate, endDate } = result.data

	if (startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if (endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

	const sources = await prisma.completedInventoryIntakeSessionItem.findMany({
		include: {
			completedInventoryIntakeSession: {
				select: {
					intakeDate: true,
					sourceName: true,
				},
			},
			specificItem: {
				include: {
					item: {
						select: {
							itemName: true,
							category: { select: { categoryName: true } },
						},
					},
				},
			},
		},
		where: {
			completedInventoryIntakeSession: {
				intakeDate: {
					gte: startDate,
					lte: endDate,
				},
			},
		},
		orderBy: {
			completedInventoryIntakeSession: { intakeDate: "asc" },
		},
	})

	const rows = sources.map((row) => {
		return {
			date: row.completedInventoryIntakeSession.intakeDate,
			amountChanged: row.amountChanged,
			itemName: row.specificItem.item.itemName,
			itemCategory: row.specificItem.item.category.categoryName,
			sourceName: row.completedInventoryIntakeSession.sourceName,
		}
	})

	const total: Record<string, Record<string, number>> = {}

	for (const { amountChanged, itemCategory, sourceName } of rows) {
		if (!(sourceName in total)) {
			total[sourceName] = {}
		}

		total[sourceName]![itemCategory] = (total[sourceName]![itemCategory] ?? 0) + amountChanged
	}

	return total
})
