export const useLogout = () => {
	const { clearPermissions } = usePermissionsStore()
	const netIDCookie = useCookie("netID")

	const logout = async () => {
		// Delete cart (ignore errors)
		try {
			await $fetch("/api/cart/cart", { method: "DELETE" })
		} catch (error) {}

		// Remove from queue (ignore errors)
		try {
			await $fetch("/api/queue", {
				method: "DELETE",
				body: { netID: netIDCookie.value },
			})
		} catch (error) {}

		netIDCookie.value = null
		clearPermissions()
		await navigateTo("/")
	}

	return { logout }
}
