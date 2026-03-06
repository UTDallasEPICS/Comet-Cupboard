import { z } from "zod"
import { prisma } from "#server/utils/db"
import { validateBody } from "#server/utils/validation"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { StatusCodes } from "http-status-codes"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z.object({
	userID: z.string(),
	action: z.enum(["ACCEPT", "REJECT"]),
})

export default defineSafeHandler(async (event) => {
	const { userID, action } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const existingRequest = await tx.roleRequest.findUnique({
			where: {
				userID: userID,
				role: RoleType.VOLUNTEER,
				User: {
					role: RoleType.STUDENT,
				},
			},
		})

		if (!existingRequest) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No pending volunteer request found for this user" })
		}

		if (action === "ACCEPT") {
			await tx.user.update({ where: { netID: userID }, data: { role: RoleType.VOLUNTEER } })
		}
		await tx.roleRequest.delete({
			where: {
				userID: userID,
			},
		})
		publishEvent(
			createEvent("volunteerRequest.decision", {
				netID: userID,
				decision: action,
			})
		)
		return "Volunteer request " + (action === "ACCEPT" ? "approved" : "rejected")
	})

	return transactionResult
})
