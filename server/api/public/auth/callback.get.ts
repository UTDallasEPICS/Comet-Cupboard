import { defineSafeHandler } from "#server/utils/handler"
import { findOrCreateStudentUserFromProfile } from "#server/utils/auth"
import { prisma } from "#server/utils/db"
import { consumeTransaction } from "#server/utils/_auth-transactions"
import { generatePublicCodeName } from "#server/utils/publicCodeNames"
import { getRandomProfileIcon } from "#server/utils/profileIcons"
import { z } from "zod"
import { StatusCodes } from "http-status-codes"
import { validateQuery } from "#server/utils/validation"
import { RoleType } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		code: z.string().min(1),
		state: z.string().min(1),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { code, state } = validateQuery(event, schema)

	const transaction = consumeTransaction(state)
	if (!transaction) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid or expired transaction state" })
	}

	const EPICS_SSO_BASE_URL = useRuntimeConfig(event).EPICS_SSO_BASE_URL

	console.log("Before token response fetch")

	let tokenResponse
	try {
		tokenResponse = await $fetch(`${EPICS_SSO_BASE_URL}/api/sso/token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: {
				client_id: transaction.client_id,
				redirect_get_callback: transaction.redirect_get_callback,
				code,
				code_verifier: transaction.verifier,
			},
		})
	} catch (error) {
		console.error("Error fetching token response:", error)
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to fetch token response" })
	}

	console.log("After token response fetch")
	console.log("Token response:", tokenResponse)

	const profile = tokenResponse as { displayName: string; firstName: string; lastName: string; email: string }
	const user = await findOrCreateStudentUserFromProfile(profile)

	console.log("User after findOrCreateStudentUserFromProfile:", user)

	const existingUserSession = await prisma.userSession.findUnique({
		where: { userID: user.userID },
	})

	console.log("Existing user session:", existingUserSession)

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

	const sessionToken = `auth_${user.userID}`
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

	await prisma.authSession.upsert({
		where: { token: sessionToken },
		update: {
			userID: user.userID,
			expiresAt,
			ipAddress: getRequestIP(event, { xForwardedFor: true }),
			userAgent: getHeader(event, "user-agent") ?? null,
		},
		create: {
			token: sessionToken,
			userID: user.userID,
			expiresAt,
			ipAddress: getRequestIP(event, { xForwardedFor: true }),
			userAgent: getHeader(event, "user-agent") ?? null,
		},
	})

	const NODE_ENV = useRuntimeConfig(event).public.NODE_ENV

	setCookie(event, "better-auth.session-token", sessionToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: NODE_ENV === "prod",
		path: "/",
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
