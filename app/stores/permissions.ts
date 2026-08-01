export const usePermissionsStore = defineStore("permissions", () => {
	const access = ref<Record<string, boolean>>({})

	const setPermissionsFromServer = async () => {
		try {
			const permissions = await $fetch("/api/public/account/updatePermissions", {
				method: "GET",
			})
			if (!permissions || typeof permissions !== "object") {
				throw new Error("Invalid permissions data")
			}
			access.value = permissions
		} catch (error) {
			access.value = {}
		}
	}

	const clearPermissions = () => {
		access.value = {}
	}

	// head admins > admins > volunteers > students
	const canHeadAdminAccess = computed(() => !!access.value.HEAD_ADMIN)
	const canAdminAccess = computed(() => canHeadAdminAccess.value || !!access.value.ADMIN)
	const canVolunteerAccess = computed(() => canAdminAccess.value || !!access.value.VOLUNTEER)
	const canStudentAccess = computed(() => canVolunteerAccess.value || !!access.value.STUDENT)
	const loggedIn = computed(() => canStudentAccess.value)

	const roleText = computed(() => {
		if (canHeadAdminAccess.value) return "Head Admin"
		if (canAdminAccess.value) return "Admin"
		if (canVolunteerAccess.value) return "Volunteer"
		if (canStudentAccess.value) return "Student"
		return "No Role"
	})

	return { setPermissionsFromServer, clearPermissions, access, canStudentAccess, canVolunteerAccess, canAdminAccess, canHeadAdminAccess, roleText, loggedIn }
})
