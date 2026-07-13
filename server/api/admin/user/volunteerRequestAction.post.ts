import { z } from "zod"
import { prisma } from "#server/utils/db"
import { validateBody } from "#server/utils/validation"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z.object({
	publicCode: z.string(),
	action: z.enum(["ACCEPT", "REJECT"]),
})

export default defineSafeHandler(async (event) => {
	const { publicCode, action } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const existingRequest = await tx.roleRequest.findUnique({
			where: {
				publicCode: publicCode,
				role: RoleType.VOLUNTEER,
			},
			include: {
				UserSession: true,
			},
		})

		if (!existingRequest) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No pending volunteer request found for this user" })
		}

		if (action === "ACCEPT") {
			await tx.user.update({ where: { userID: existingRequest.UserSession.userID }, data: { role: RoleType.VOLUNTEER } })
		}
		await tx.roleRequest.delete({
			where: {
				publicCode: publicCode,
			},
		})
		publishEvent(
			createEvent("volunteerRequest.decision", {
				publicCode: publicCode,
				decision: action,
				userID: existingRequest.UserSession.userID,
			})
		)
		return "Volunteer request " + (action === "ACCEPT" ? "approved" : "rejected")
	})

	return transactionResult
})
