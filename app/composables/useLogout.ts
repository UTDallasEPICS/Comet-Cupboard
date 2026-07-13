export const useLogout = () => {
	const permissionsStore = usePermissionsStore()
	const userSessionStore = useUserSessionInfoStore()
	const userIDCookie = useCookie("userID")

	const logout = async () => {
		// Delete user session (ignore errors)
		try {
			await $fetch("/api/public/account/logout", { method: "POST" })
		} catch (error) {}

		userIDCookie.value = null
		permissionsStore.clearPermissions()
		userSessionStore.clearUserSessionInfo()
		await navigateTo("/")
		reloadNuxtApp()
	}

	return { logout }
}
