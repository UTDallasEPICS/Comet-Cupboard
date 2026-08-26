import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { sourceDetailsSchema } from "#shared/utils/formSchemas"

const schema = sourceDetailsSchema.extend({ sourceID: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { sourceID, sourceName, archived } = await validateBody(event, schema)

	if (!sourceID) {
		return await prisma.$transaction(async (tx) => {
			const newSource = await tx.source.create({
				data: {
					sourceName: sourceName,
					archived: archived,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "SOURCE_CREATED",
					message: `Source created: ${newSource.sourceID}`,
					userID: event.context.userSession.userID,
				},
			})
			return newSource
		})
	} else {
		return await prisma.$transaction(async (tx) => {
			const updatedSource = await tx.source.update({
				where: { sourceID },
				data: {
					sourceName: sourceName,
					archived: archived,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "SOURCE_EDITED",
					message: `Source updated: ${updatedSource.sourceID}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedSource
		})
	}
})
