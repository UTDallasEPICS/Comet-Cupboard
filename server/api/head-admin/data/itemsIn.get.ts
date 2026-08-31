import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { getTimeLevel } from "~~/server/utils/data"

const schema = z.object({
	timeLevel: z.enum(["Day", "Week", "Month", "Semester"]).default("Day"),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
})

const validateSchema = schema.strict()

export default defineSafeHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { timeLevel, startDate, endDate } = result.data

	if (startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if (endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

	const itemChanges = await prisma.completedInventoryIntakeSessionItem.findMany({
		include: {
			completedInventoryIntakeSession: true,
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

	const parsedRows = itemChanges.map((row) => ({
		date: row.completedInventoryIntakeSession.intakeDate,
		amountChanged: row.amountChanged,
		itemName: row.specificItem.item.itemName,
		itemCategory: row.specificItem.item.category.categoryName,
		specificItemName: row.specificItem.productName,
		sessionName: row.completedInventoryIntakeSession.inventoryIntakeSessionName,
		source: row.completedInventoryIntakeSession.sourceName,
	}))

	if (parsedRows.length === 0) {
		return { periodTotals: {}, rows: [] }
	}

	const firstDate = startDate ?? new Date(parsedRows[0]!.date)
	const lastDate = endDate ?? new Date(parsedRows[parsedRows.length - 1]!.date)
	const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
	const periodTotals: Record<string, number> = {}
	let curDate = new Date(firstDate)
	while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) === lastTimeLevel) {
		const level = getTimeLevel(curDate, timeLevel)
		if (periodTotals[level] == undefined) {
			periodTotals[level] = 0
		}

		// Increment days within time range
		switch (timeLevel) {
			case "Day":
				curDate.setDate(curDate.getDate() + 1)
				break
			case "Week":
				curDate.setDate(curDate.getDate() + 7)
				break
			case "Month":
				curDate.setMonth(curDate.getMonth() + 1)
				break
			case "Semester":
				curDate.setMonth(curDate.getMonth() + 1)
				break
		}
	}

	const rows = parsedRows.map((row) => {
		const period = getTimeLevel(row.date, timeLevel)
		periodTotals[period] = (periodTotals[period] ?? 0) + row.amountChanged

		return {
			period,
			sessionName: row.sessionName,
			source: row.source,
			category: row.itemCategory,
			item: row.itemName,
			specificItem: row.specificItemName,
			quantity: row.amountChanged,
		}
	})

	return { periodTotals, rows }
})
