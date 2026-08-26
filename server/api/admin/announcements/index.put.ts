import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { announcementDateTime, announcementSchema } from "#shared/utils/formSchemas"

const schema = announcementSchema.extend({ announcementID: z.string() }).strict()

const toISOString = (date: Parameters<typeof announcementDateTime>[0], time: Parameters<typeof announcementDateTime>[1]) =>
	announcementDateTime(date, time).toISOString()

export default defineSafeHandler(async (event) => {
	const { announcementID, message, startsDate, endsDate, startsTime, endsTime } = await validateBody(event, schema)
	const startsAt = toISOString(startsDate, startsTime)
	const endsAt = toISOString(endsDate, endsTime)

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
