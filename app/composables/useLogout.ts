export const useLogout = () => {
	const netIDCookie = useCookie("netID")
	const accessCookie = useCookie("access")
	const permissions = ref({})

	const logout = async () => {
		// Delete cart (ignore errors)
		try {
			await $fetch("/api/cart/cart", { method: "DELETE" })
		} catch (err) {}

		// Remove from queue (ignore errors)
		try {
			await $fetch("/api/queue", {
				method: "DELETE",
				body: { netID: netIDCookie.value },
			})
		} catch (err) {}

		// Clear cookies
		netIDCookie.value = null
		accessCookie.value = null
		permissions.value = accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}

		// Navigate to homepage
		await navigateTo("/")
	}

	return { logout }
}
