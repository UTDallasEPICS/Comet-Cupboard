import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"
import { z } from "zod"

const schema = z.object({ announcementID: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { announcementID } = validateQuery(event, schema)
	await prisma.$transaction(async (tx) => {
		const announcement = await tx.announcement.delete({ where: { announcementID } })
		await tx.auditLog.create({
			data: {
				action: "ANNOUNCEMENT_EDITED",
				message: `Announcement deleted: ${announcement.message}`,
				userID: event.context.userSession.userID,
			},
		})
	})
	return "Announcement deleted"
})
