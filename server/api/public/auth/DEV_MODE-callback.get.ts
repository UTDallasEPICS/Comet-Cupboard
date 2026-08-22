import { defineSafeHandler } from "#server/utils/handler"
import { findOrCreateStudentUserFromProfile } from "#server/utils/auth"
import { prisma } from "#server/utils/db"
import { generatePublicCodeName } from "#server/utils/publicCodeNames"
import { getRandomProfileIcon } from "#server/utils/profileIcons"
import { z } from "zod"
import { validateQuery } from "#server/utils/validation"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		username: z.string().min(1),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const NODE_ENV = useRuntimeConfig(event).public.NODE_ENV

	if (NODE_ENV !== "nonprod") {
		throw createError({ statusCode: 403, statusMessage: "This endpoint is only available in nonprod mode" })
	}

	const { username } = validateQuery(event, schema)
	const profile = {
		displayName: username,
		firstName: "Penguinistrator",
		lastName: "",
		email: `${username}@utdallas.edu`,
	}
	const user = await findOrCreateStudentUserFromProfile(profile)

	const existingUserSession = await prisma.userSession.findUnique({
		where: { userID: user.userID },
	})

	if (!existingUserSession) {
		let publicCode = generatePublicCodeName()
		while (
			await prisma.userSession.findUnique({
				where: { publicCode },
			})
		) {
			publicCode = generatePublicCodeName()
		}

		await prisma.userSession.create({
			data: {
				userID: user.userID,
				publicCode,
				publicIcon: getRandomProfileIcon(),
			},
		})
	}

	await setUserSession(event, {
		user: {
			displayName: user.displayName,
			role: user.role,
		},
		secure: {
			userID: user.userID,
		},
	})

	const userRole = user.role

	if (userRole === RoleType.HEAD_ADMIN) {
		return sendRedirect(event, "/head-admin", 302)
	} else if (userRole === RoleType.ADMIN) {
		return sendRedirect(event, "/admin", 302)
	} else if (userRole === RoleType.VOLUNTEER) {
		return sendRedirect(event, "/volunteer", 302)
	} else {
		return sendRedirect(event, "/student", 302)
	}
})
