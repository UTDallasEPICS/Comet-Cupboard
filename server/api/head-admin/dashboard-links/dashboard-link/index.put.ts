import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
const schema = z
	.object({
		dashboardLinkID: z.string(),
		displayName: z.string().trim().min(1),
		url: z.url({
			protocol: /^https?$/,
			hostname: z.regexes.domain,
		}),
		description: z.string().default(""),
		dashboardRolePage: z.enum(["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]),
		displayOrder: z.number().int().default(0),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { dashboardLinkID, displayName, url, description, dashboardRolePage, displayOrder } = await validateBody(event, schema)

	if (!dashboardLinkID) {
		return await prisma.$transaction(async (tx) => {
			const dashboardLink = await tx.dashboardLink.create({
				data: { displayName, url, description, dashboardRolePage, displayOrder },
			})
			await tx.auditLog.create({
				data: {
					action: "DASHBOARD_LINKS_CREATED",
					message: `Dashboard link created: ${dashboardLink.displayName}`,
					userID: event.context.userSession.userID,
				},
			})
			return dashboardLink
		})
	} else {
		return await prisma.$transaction(async (tx) => {
			const dashboardLink = await tx.dashboardLink.update({
				where: { dashboardLinkID },
				data: { displayName, url, description, dashboardRolePage, displayOrder },
			})
			await tx.auditLog.create({
				data: {
					action: "DASHBOARD_LINKS_EDITED",
					message: `Dashboard link updated: ${dashboardLink.displayName}`,
					userID: event.context.userSession.userID,
				},
			})
			return dashboardLink
		})
	}
})
