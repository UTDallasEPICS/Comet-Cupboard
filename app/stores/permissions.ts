// stores/permissions.ts
export const usePermissionsStore = defineStore("permissions", () => {
	const access = ref<Record<string, boolean>>({})

	const setPermissionsFromServer = async () => {
		try {
			await $fetch("/api/updatePermissions", {
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

	const canStudentAccess = computed(() => !!access.value.STUDENT)
	const canVolunteerAccess = computed(() => !!access.value.VOLUNTEER)
	const canAdminAccess = computed(() => !!access.value.ADMIN)

	return { setPermissionsFromServer, clearPermissions, canStudentAccess, canVolunteerAccess, canAdminAccess }
})
