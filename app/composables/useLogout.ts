export const useLogout = () => {
	const permissionsStore = usePermissionsStore()
	const netIDCookie = useCookie("netID")

	const logout = async () => {
		// Delete cart (ignore errors)
		try {
			await $fetch("/api/student/cart/cart", { method: "DELETE" })
		} catch (error) {}

		// Remove from queue (ignore errors)
		try {
			await $fetch("/api/student/queue/leave", {
				method: "POST",
			})
		} catch (error) {}

		netIDCookie.value = null
		permissionsStore.clearPermissions()
		await navigateTo("/")
		reloadNuxtApp()
	}

	return { logout }
}
