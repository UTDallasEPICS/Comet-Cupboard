export const usePermissionsStore = defineStore("permissions", () => {
	const access = ref<Record<string, boolean>>({})

	const setPermissionsFromServer = async () => {
		try {
			await $fetch("/api/public/account/updatePermissions", {
				method: "GET",
			})
			const accessCookiePermission = useCookie("AccessPermission")
			const permissions = accessCookiePermission.value && typeof accessCookiePermission.value === "object" ? accessCookiePermission.value : {}
			access.value = permissions || {}
		} catch (error) {
			access.value = {}
			const accessCookiePermission = useCookie("AccessPermission")
			accessCookiePermission.value = null
		}
	}

	const clearPermissions = () => {
		access.value = {}
		const accessCookiePermission = useCookie("AccessPermission")
		accessCookiePermission.value = null
	}

	// head admins > admins > volunteers > students
	const canHeadAdminAccess = computed(() => !!access.value.HEAD_ADMIN)
	const canAdminAccess = computed(() => canHeadAdminAccess.value || !!access.value.ADMIN)
	const canVolunteerAccess = computed(() => canAdminAccess.value || !!access.value.VOLUNTEER)
	const canStudentAccess = computed(() => canVolunteerAccess.value || !!access.value.STUDENT)

	const roleText = computed(() => {
		if (canHeadAdminAccess.value) return "Head Admin"
		if (canAdminAccess.value) return "Admin"
		if (canVolunteerAccess.value) return "Volunteer"
		if (canStudentAccess.value) return "Student"
		return "No Role"
	})

	return { setPermissionsFromServer, clearPermissions, canStudentAccess, canVolunteerAccess, canAdminAccess, canHeadAdminAccess, roleText }
})
