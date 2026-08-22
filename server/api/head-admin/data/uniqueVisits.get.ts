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
	//validating input
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

	//query with time sorting
	const sessions = await prisma.order.findMany({
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

	// maps data into rows
	const rows = sessions.map((row) => {
		return {
			createdAt: row.createdAt,
			label: row.userID,
			count: 1,
		}
	})

	const firstDate = startDate ?? new Date(rows[0]!.createdAt)
	const lastDate = endDate ?? new Date(rows[rows.length - 1]!.createdAt)
	const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
	const allTimeLevels: Record<string, Record<string, number> | number> = {}
	let curDate = new Date(firstDate)
	while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) === lastTimeLevel) {
		const level = getTimeLevel(curDate, timeLevel)
		if (allTimeLevels[level] == undefined) {
			allTimeLevels[level] = {}
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

	//fill data into allTimeLevels
	for (const { createdAt, label, count } of rows) {
		const time = getTimeLevel(createdAt, timeLevel)
		const levelLabels = allTimeLevels[time] as Record<string, number>
		if (!levelLabels[label]) {
			levelLabels[label] = 0
		}
		levelLabels[label] += count
	}

	// sum up unique users per time level
	for (const time in allTimeLevels) {
		const labels = allTimeLevels[time] as Record<string, number>
		allTimeLevels[time] = Object.keys(labels).length
	}

	return allTimeLevels
})
