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

	const canAdminAccess = computed(() => !!access.value.ADMIN)
	const canVolunteerAccess = computed(() => canAdminAccess.value || !!access.value.VOLUNTEER)
	const canStudentAccess = computed(() => canVolunteerAccess.value || !!access.value.STUDENT)

	return { setPermissionsFromServer, clearPermissions, canStudentAccess, canVolunteerAccess, canAdminAccess }
})
