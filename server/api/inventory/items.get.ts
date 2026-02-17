import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

const schema = z.object({
	getCounts: z.string().default("false"),
	checkAvailability: z.string().default("false"),
	includeArchived: z.string().default("false"),
})

const validateSchema = schema.strict().partial()

// Only people with AccessPermission.INVENTORY_MANAGEMENT are allowed to use getCounts query param to get item quantities

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { getCounts, checkAvailability, includeArchived } = queries.data

	if (getCounts === "true" && !event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT]) {
		throw createError({ statusCode: 403, statusMessage: `User ${event.context.user.netID} is unauthorized to view inventory item counts` })
	}

	const showCounts: boolean = getCounts === "true" && event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT]

	const items = await prisma.item.findMany({
		where: {
			// if checking availability, count must be greater than 0
			// and archived must be false
			...((checkAvailability === "true") ? { quantity: { gt: 0 } } : {}),
			...((includeArchived === "false") ? { archived: false } : {})
		},
		omit: { quantity: !showCounts },
		include: {
			Deal: true,
		},
	})
	if (!items) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find items" })
	}
	return items
})
