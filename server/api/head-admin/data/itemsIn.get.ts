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

	if(startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if(endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

	const itemChanges = await prisma.itemCountChange.findMany({
		include: {
			Item: {
				select: {
					name: true,
					categoryName: true,
					quantity: true,
				},
			},
		},
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
		orderBy: {
			date: "asc",
		},
	})

    const rows = itemChanges.map((row) => {
        return{
            date: row.date,
            amountChanged: row.amountChanged,
            itemName: row.Item.name,
            itemCategory: row.Item.categoryName,
            itemQty: row.Item.quantity,
        }
    })

	if (rows.length === 0) {
		return {}
	}
	
	const firstDate = startDate ?? new Date(rows[0]?.date)
	const lastDate = endDate ?? new Date(rows[rows.length - 1]?.date)
	const lastTimeLevel = getTimeLevel(lastDate, timeLevel)
	const donationsByTimeLevel = {}
	let curDate = new Date(firstDate)
	while (curDate <= lastDate || getTimeLevel(curDate, timeLevel) === lastTimeLevel) {
		const level = getTimeLevel(curDate, timeLevel)
		if (donationsByTimeLevel[level] == undefined) {
			donationsByTimeLevel[level] = {}
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

	for (const row of rows) {
		const level = getTimeLevel(row.date, timeLevel)
		const category = row.itemCategory
		const item = row.itemName

		if (!(category in donationsByTimeLevel[level])) {
			donationsByTimeLevel[level][category] = { total: 0, items: {} }
		}

		donationsByTimeLevel[level][category].total += row.amountChanged

		if (!(item in donationsByTimeLevel[level][category].items)){
			donationsByTimeLevel[level][category].items[item] = 0
		}

		donationsByTimeLevel[level][category].items[item] += row.amountChanged
	}

	return donationsByTimeLevel
})
