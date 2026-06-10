import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { z } from "zod"

const schema = z.object({
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
})

const validateSchema = schema.strict()

export default defineSafeHandler(async (event) => {
	const result = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))

	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}

	const { startDate, endDate } = result.data

	if(startDate) {
		startDate.setHours(0, 0, 0, 0)
	}

	if(endDate) {
		endDate.setHours(23, 59, 59, 999)
	}

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
        return {
            date: row.date,
            amountChanged: row.amountChanged,
            itemName: row.Item.name,
            itemCategory: row.Item.categoryName,
            sourceName: row.Source.name,
        }
    })

	const total = {}

    for (const {amountChanged, itemCategory, sourceName} of rows){
		if (!(sourceName in total)){
			total[sourceName] = {}
		}

		if (sourceName in total){
			total[sourceName][itemCategory] = amountChanged 
		} else {
			total[sourceName][itemCategory] += amountChanged
		}
	}

	return total
})
