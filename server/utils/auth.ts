import { RoleType } from "../../prisma/generated/prisma/client"
import { prisma } from "#server/utils/db"
import type { SsoProfile } from "#shared/types/auth"

export const findOrCreateStudentUserFromProfile = async (profile: SsoProfile) => {
	const normalizedEmail = profile.email.trim().toLowerCase()

	const existingUser = await prisma.user.findUnique({
		where: { userID: normalizedEmail },
	})

	if (existingUser) {
		return existingUser
	}

	return await prisma.user.create({
		data: {
			userID: normalizedEmail,
			displayName: profile.displayName.trim(),
			role: RoleType.STUDENT,
		},
	})
}
