import ExcelJS from "exceljs"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"

const schema = z.object({
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

	const { startDate, endDate, format } = result.data

	if (startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if (endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

	const sourceRows = await prisma.completedInventoryIntakeSessionItem.findMany({
		include: {
			completedInventoryIntakeSession: {
				select: {
					sourceName: true,
				},
			},
			specificItem: {
				include: {
					item: {
						select: {
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
	})

	const totals: Record<string, Record<string, number>> = {}

	for (const row of sourceRows) {
		const sourceName = row.completedInventoryIntakeSession.sourceName
		const categoryName = row.specificItem.item.category.categoryName

		if (!totals[sourceName]) {
			totals[sourceName] = {}
		}

		totals[sourceName]![categoryName] = (totals[sourceName]![categoryName] ?? 0) + row.amountChanged
	}

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Sources")

	worksheet.columns = [
		{ header: "Source", key: "source", width: 28 },
		{ header: "Category", key: "category", width: 24 },
		{ header: "Items", key: "quantity", width: 14 },
	]

	for (const [source, categories] of Object.entries(totals)) {
		for (const [category, quantity] of Object.entries(categories)) {
			worksheet.addRow({ source, category, quantity })
		}
	}

	if (format === "csv") {
		const buffer = await workbook.csv.writeBuffer({ sheetName: worksheet.name })
		setHeader(event, "Content-Type", "text/csv; charset=utf-8")
		setHeader(event, "Content-Disposition", 'attachment; filename="source-contributions.csv"')
		return buffer
	}

	const xlsxBuffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="source-contributions.xlsx"')
	return xlsxBuffer
})
