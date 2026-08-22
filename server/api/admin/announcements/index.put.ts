import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		announcementID: z.string(),
		message: z.string().trim().min(1),
		startsAt: z.coerce.date(),
		endsAt: z.coerce.date(),
	})
	.strict()
	.refine((value) => value.endsAt > value.startsAt, { message: "End date must be after start date", path: ["endsAt"] })

export default defineSafeHandler(async (event) => {
	const { announcementID, message, startsAt, endsAt } = await validateBody(event, schema)

	if (!announcementID) {
		return await prisma.$transaction(async (tx) => {
			const announcement = await tx.announcement.create({ data: { message, startsAt, endsAt } })
			await tx.auditLog.create({
				data: {
					action: "ANNOUNCEMENT_CREATED",
					message: `Announcement created: ${announcement.message}`,
					userID: event.context.userSession.userID,
				},
			})
			return announcement
		})
	} else {
		return await prisma.$transaction(async (tx) => {
			const announcement = await tx.announcement.update({ where: { announcementID }, data: { message, startsAt, endsAt } })
			await tx.auditLog.create({
				data: {
					action: "ANNOUNCEMENT_EDITED",
					message: `Announcement updated: ${announcement.message}`,
					userID: event.context.userSession.userID,
				},
			})
			return announcement
		})
	}
})
