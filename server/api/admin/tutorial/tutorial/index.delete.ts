import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		tutorialID: z.string().min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { tutorialID } = validateQuery(event, schema)

	await prisma.$transaction(async (tx) => {
		const tutorial = await tx.tutorial.delete({ where: { tutorialID } })
		await tx.auditLog.create({
			data: {
				action: "TUTORIAL_EDITED",
				message: `Tutorial deleted: ${tutorial.tutorialName}`,
				userID: event.context.userSession.userID,
			},
		})
	})
	return "Tutorial deleted"
})
