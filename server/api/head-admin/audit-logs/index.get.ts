import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		action: z.string().optional(),
		search: z.string().optional(),
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
	})
	.strict()
	.refine((value) => !value.startDate || !value.endDate || value.startDate <= value.endDate, {
		message: "Start date must be before end date",
	})

export default defineSafeHandler(async (event) => {
	const { action, search, startDate, endDate } = validateQuery(event, schema)
	return await prisma.auditLog.findMany({
		where: {
			...(action ? { action: action as any } : {}),
			...(search ? { message: { contains: search } } : {}),
			...((startDate || endDate) ? { timestamp: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } } : {}),
		},
		orderBy: { timestamp: "desc" },
		include: { user: { select: { userID: true, displayName: true } } },
		take: 500,
	})
})
