import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z
	.object({
		tutorialStepID: z.string().min(1),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { tutorialStepID } = validateQuery(event, schema)

	await prisma.$transaction(async (tx) => {
		const tutorialStep = await tx.tutorialStep.delete({ where: { tutorialStepID } })
		await tx.auditLog.create({
			data: {
				action: "TUTORIAL_EDITED",
				message: `Tutorial step deleted: ${tutorialStep.tutorialStepID}`,
				userID: event.context.userSession.userID,
			},
		})
	})
	return "Tutorial step deleted"
})
