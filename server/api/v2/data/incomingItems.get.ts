import { z } from "zod"

const schema = z.object({
	timeLevel: z.enum(["Day", "Week", "Month", "Semester", "Year"]).default("Day"),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
})

const validateSchema = schema.strict()

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { timeLevel, startDate, endDate } = result.data

	// query with time filtering
	const itemCountChanges = await event.context.prisma.itemCountChange.findMany({
		where: {
			...(startDate ? { date: { gte: startDate } } : {}),
			...(endDate ? { date: { lte: endDate } } : {}),
		},
		include: {
			Item: {
				select: {
					itemID: true,
					name: true,
					categoryName: true,
				},
			},
		},
		orderBy: { date: "asc" },
	})

	if (itemCountChanges.length === 0) return {}

	// map into data rows
	const rows = itemCountChanges.map((row) => {
		return {
			date: row.date,
			category: row.Item.categoryName,
			item: row.Item.name,
			count: row.amountChanged,
		}
	})

	// determine full range of dates for filling missing time levels
	const firstDate = startDate ?? new Date(rows[0].date)
	const lastDate = endDate ?? new Date(rows[rows.length - 1].date)
	const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
	const allTimeLevels = {}
	let curDate = new Date(firstDate)
	while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) == lastTimeLevel) {
		const level = getTimeLevel(curDate, timeLevel)
		if (allTimeLevels[level] == undefined) {
			allTimeLevels[level] = {}
		}

		// Increment curDate
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
				// + 1 month just to be safe
				curDate.setMonth(curDate.getMonth() + 1)
				break
			case "Year":
				curDate.setFullYear(curDate.getFullYear() + 1)
				break
		}
	}

	// fill data into allTimeLevels
	for (const { date, category, item, count } of rows) {
		if (!allTimeLevels[getTimeLevel(date, timeLevel)][category]) {
			allTimeLevels[getTimeLevel(date, timeLevel)][category] = {}
		}
		if (!allTimeLevels[getTimeLevel(date, timeLevel)][category][item]) {
			allTimeLevels[getTimeLevel(date, timeLevel)][category][item] = 0
		}
		allTimeLevels[getTimeLevel(date, timeLevel)][category][item] += count
	}

	return allTimeLevels
})
