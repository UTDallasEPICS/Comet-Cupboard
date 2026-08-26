import ExcelJS from "exceljs"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"
import { getTimeLevel } from "~~/server/utils/data"

const schema = z.object({
	timeLevel: z.enum(["Day", "Week", "Month", "Semester"]).default("Day"),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	format: z.enum(["xlsx", "csv"]).default("xlsx"),
})

const validateSchema = schema.strict()

export default defineSafeHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { timeLevel, startDate, endDate, format } = result.data

	if (startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if (endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

	const orders = await prisma.order.findMany({
		include: {
			orderItems: {
				include: {
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
			},
		},
		where: {
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	})

	const sourceRows = orders.flatMap((order) => {
		return order.orderItems.map((item) => ({
			date: order.createdAt,
			distributionCount: item.count,
			itemCategory: item.specificItem.item.category.categoryName,
			itemName: item.specificItem.item.itemName,
		}))
	})

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Items Out")

	worksheet.columns = [
		{ header: "Period", key: "period", width: 20 },
		{ header: "Category", key: "category", width: 24 },
		{ header: "Item", key: "item", width: 32 },
		{ header: "Quantity", key: "quantity", width: 14 },
	]

	if (sourceRows.length > 0) {
		const firstDate = startDate ?? new Date(sourceRows[0]!.date)
		const lastDate = endDate ?? new Date(sourceRows[sourceRows.length - 1]!.date)
		const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
		const byPeriod: Record<string, Record<string, { total: number; items: Record<string, number> }>> = {}
		let curDate = new Date(firstDate)

		while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) === lastTimeLevel) {
			const level = getTimeLevel(curDate, timeLevel)
			if (byPeriod[level] == undefined) {
				byPeriod[level] = {}
			}

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

		for (const row of sourceRows) {
			const level = getTimeLevel(row.date, timeLevel)
			const category = row.itemCategory
			const item = row.itemName
			const levelTotals = byPeriod[level]!

			if (!(category in levelTotals)) {
				levelTotals[category] = { total: 0, items: {} }
			}

			levelTotals[category]!.total += row.distributionCount

			if (!(item in levelTotals[category]!.items)) {
				levelTotals[category]!.items[item] = 0
			}

			levelTotals[category]!.items[item]! += row.distributionCount
		}

		for (const [period, categories] of Object.entries(byPeriod)) {
			for (const [category, values] of Object.entries(categories)) {
				for (const [item, quantity] of Object.entries(values.items)) {
					worksheet.addRow({ period, category, item, quantity })
				}
			}
		}
	}

	if (format === "csv") {
		const buffer = await workbook.csv.writeBuffer({ sheetName: worksheet.name })
		setHeader(event, "Content-Type", "text/csv; charset=utf-8")
		setHeader(event, "Content-Disposition", 'attachment; filename="items-out.csv"')
		return buffer
	}

	const xlsxBuffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="items-out.xlsx"')
	return xlsxBuffer
})
