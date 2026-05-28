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

	const sources = await prisma.itemCountChange.findMany({
		include: {
			Item: {
				select: {
					name: true,
					categoryName: true,
					quantity: true,
				},
			},
            Source:{ 
                select: {
                    name: true
                }
            }
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

    const rows = sources.map((row) => {
        return{
            date: row.date,
            amountChanged: row.amountChanged,
            itemName: row.Item.name,
            itemCategory: row.Item.categoryName,
            itemQty: row.Item.quantity,
            sourceName: row.Source.name
        }
    })

    console.log("rows: ", rows)

	return sources
})
