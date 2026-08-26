import ExcelJS from "exceljs"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"

const schema = z.object({
	format: z.enum(["xlsx", "csv"]).default("xlsx"),
})

const validateSchema = schema.strict()

export default defineSafeHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { format } = result.data

	const items = await prisma.item.findMany({
		orderBy: {
			itemName: "asc",
		},
		include: {
			category: true,
			specificItems: true,
		},
	})

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Inventory")

	worksheet.columns = [
		{ header: "Category", key: "category", width: 24 },
		{ header: "Item", key: "item", width: 32 },
		{ header: "Quantity", key: "quantity", width: 14 },
	]

	for (const item of items) {
		worksheet.addRow({
			category: item.category.categoryName,
			item: item.itemName,
			quantity: item.specificItems.reduce((sum, specificItem) => sum + Number(specificItem.quantity), 0),
		})
	}

	if (format === "csv") {
		const buffer = await workbook.csv.writeBuffer({ sheetName: worksheet.name })
		setHeader(event, "Content-Type", "text/csv; charset=utf-8")
		setHeader(event, "Content-Disposition", 'attachment; filename="inventory-by-item.csv"')
		return buffer
	}

	const xlsxBuffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="inventory-by-item.xlsx"')
	return xlsxBuffer
})
