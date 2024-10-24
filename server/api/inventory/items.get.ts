import { z } from "zod"
import { AccessPermission } from "~/permissions"

const schema = z.object({
	getCounts: z.string().default("false"),
})

const validateSchema = schema.strict().partial()

// event.context.permissions[AccessPermission.SHOPPING_ACTION]

export default defineEventHandler(async (event) => {
	const queries = await getValidatedQuery(event, (query) => validateSchema.safeParse(query))
	if (!queries.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request parameters" })
	}
	const { getCounts } = queries.data

	if (getCounts === "true" && !event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT]) {
		throw createError({ statusCode: 403, statusMessage: "User is unauthorized to view inventory item counts" })
	}

	const showCounts: boolean = getCounts === "true" && event.context.permissions[AccessPermission.INVENTORY_MANAGEMENT]

	const items = await event.context.prisma.item.findMany({
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
