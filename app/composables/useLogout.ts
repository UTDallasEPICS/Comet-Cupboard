export const useLogout = () => {
	const permissionsStore = usePermissionsStore()
	const userSessionStore = useUserSessionInfoStore()
	const authSessionCookie = useCookie("better-auth.session-token")

	const logout = async () => {
		// Delete user session (ignore errors)
		try {
			await $fetch("/api/public/auth/logout")
		} catch (error) {}

		authSessionCookie.value = null
		permissionsStore.clearPermissions()
		userSessionStore.clearUserSessionInfo()
		await navigateTo("/")
		reloadNuxtApp()
	}

	return { logout }
}
