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
		where: {
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
		select: {
			createdAt: true,
			userID: true,
		},
	})

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Visits")

	worksheet.columns = [
		{ header: "Period", key: "period", width: 20 },
		{ header: "Visits", key: "visits", width: 14 },
		{ header: "Unique Visits", key: "uniqueVisits", width: 16 },
	]

	const firstDate = startDate ?? orders[0]?.createdAt
	const lastDate = endDate ?? orders.at(-1)?.createdAt

	if (firstDate && lastDate) {
		const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
		const levels: Record<string, Record<string, number>> = {}
		let curDate = new Date(firstDate)

		while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) === lastTimeLevel) {
			const level = getTimeLevel(curDate, timeLevel)
			if (levels[level] == undefined) {
				levels[level] = {}
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

		for (const row of orders) {
			const period = getTimeLevel(row.createdAt, timeLevel)
			const labels = levels[period]!
			labels[row.userID] = (labels[row.userID] ?? 0) + 1
		}

		for (const [period, labels] of Object.entries(levels)) {
			const visits = Object.values(labels).reduce((sum, value) => sum + value, 0)
			const uniqueVisits = Object.keys(labels).length
			worksheet.addRow({ period, visits, uniqueVisits })
		}
	}

	if (format === "csv") {
		const buffer = await workbook.csv.writeBuffer({ sheetName: worksheet.name })
		setHeader(event, "Content-Type", "text/csv; charset=utf-8")
		setHeader(event, "Content-Disposition", 'attachment; filename="visitor-activity.csv"')
		return buffer
	}

	const xlsxBuffer = await workbook.xlsx.writeBuffer()
	setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	setHeader(event, "Content-Disposition", 'attachment; filename="visitor-activity.xlsx"')
	return xlsxBuffer
})
