import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z.object({ action: z.string().optional(), search: z.string().optional() }).strict()

export default defineSafeHandler(async (event) => {
	const { action, search } = validateQuery(event, schema)
	return await prisma.auditLog.findMany({
		where: {
			...(action ? { action: action as any } : {}),
			...(search ? { message: { contains: search } } : {}),
		},
		orderBy: { timestamp: "desc" },
		include: { user: { select: { userID: true, displayName: true } } },
		take: 500,
	})
})
