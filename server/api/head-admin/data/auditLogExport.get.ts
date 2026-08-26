import ExcelJS from "exceljs"
import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

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

	const logs = await prisma.auditLog.findMany({
		where: {
			...(startDate || endDate
				? {
						timestamp: {
							...(startDate ? { gte: startDate } : {}),
							...(endDate ? { lte: endDate } : {}),
						},
					}
				: {}),
		},
		orderBy: { timestamp: "desc" },
		include: {
			user: {
				select: {
					displayName: true,
				},
			},
		},
		take: 500,
	})

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Audit Log")

	worksheet.columns = [
		{ header: "Timestamp", key: "timestamp", width: 24 },
		{ header: "Action", key: "action", width: 32 },
		{ header: "User", key: "user", width: 28 },
		{ header: "Details", key: "message", width: 72 },
	]

	for (const log of logs) {
		worksheet.addRow({
			timestamp: log.timestamp,
			action: log.action,
			user: log.user?.displayName ?? "System",
			message: log.message,
		})
	}

	if (format === "csv") {
		const buffer = await workbook.csv.writeBuffer({ sheetName: worksheet.name })
		setHeader(event, "Content-Type", "text/csv; charset=utf-8")
		setHeader(event, "Content-Disposition", 'attachment; filename="audit-log.csv"')
		return buffer
	}

	const xlsxBuffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="audit-log.xlsx"')
	return xlsxBuffer
})
