import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		tutorialID: z.string(),
		tutorialGroupID: z.string().min(1),
		tutorialName: z
			.string()
			.min(1)
			.max(30)
			.regex(/^[A-Za-z ]+$/),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { tutorialID, tutorialName, tutorialGroupID } = await validateBody(event, schema)

	if (!tutorialID) {
		return await prisma.$transaction(async (tx) => {
			const newTutorial = await tx.tutorial.create({
				data: {
					tutorialName,
					tutorialGroupID,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "TUTORIAL_CREATED",
					message: `Tutorial created: ${newTutorial.tutorialName}`,
					userID: event.context.userSession.userID,
				},
			})
			return newTutorial
		})
	} else {
		return await prisma.$transaction(async (tx) => {
			const updatedTutorial = await tx.tutorial.update({
				where: {
					tutorialID,
				},
				data: {
					tutorialName,
				},
			})
			await tx.auditLog.create({
				data: {
					action: "TUTORIAL_EDITED",
					message: `Tutorial updated: ${updatedTutorial.tutorialName}`,
					userID: event.context.userSession.userID,
				},
			})
			return updatedTutorial
		})
	}
})
