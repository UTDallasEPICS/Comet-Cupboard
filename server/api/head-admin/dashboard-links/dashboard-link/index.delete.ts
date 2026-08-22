import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"
import { z } from "zod"

const schema = z.object({ dashboardLinkID: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { dashboardLinkID } = validateQuery(event, schema)

	await prisma.$transaction(async (tx) => {
		const link = await tx.dashboardLink.delete({ where: { dashboardLinkID: dashboardLinkID } })
		await tx.auditLog.create({
			data: {
				action: "DASHBOARD_LINKS_EDITED",
				message: `Dashboard link deleted: ${link.displayName}`,
				userID: event.context.userSession.userID,
			},
		})
	})
	return "Dashboard link deleted"
})
