import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { validateBody } from "#server/utils/validation"
import { defineSafeHandler } from "#server/utils/handler"
import { generatePublicCodeName } from "#server/utils/publicCodeNames"
import { getRandomProfileIcon } from "#server/utils/profileIcons"

const schema = z
	.object({
		userID: z.string().length(9),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { userID } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		let userSession = await tx.userSession.findUnique({
			where: {
				userID: userID,
			},
			include: {
				User: true,
			},
		})
		if (!userSession) {
			const user = await tx.user.findUnique({
				where: {
					userID: userID,
				},
			})
			if (!user) {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User not found" })
			} else {
				const allPublicCodeNames = await tx.userSession.findMany({
					select: {
						publicCode: true,
					},
				})

				let newPublicCodeName = generatePublicCodeName()
				while (allPublicCodeNames.some((session) => session.publicCode === newPublicCodeName)) {
					newPublicCodeName = generatePublicCodeName()
				}

				userSession = await tx.userSession.create({
					data: {
						userID: user.userID,
						publicCode: newPublicCodeName,
						publicIcon: getRandomProfileIcon(),
					},
					include: {
						User: true,
					},
				})
			}
		}
		setCookie(event, "userID", userID)
		return "Login successful"
	})

	return transactionResult
})
