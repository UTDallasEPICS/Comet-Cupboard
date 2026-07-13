interface CartSession {
	publicCode: string
	publicIcon: string
}

export const useCartSessionsStore = defineStore("cartSessions", () => {
	const cartSessions = ref<Array<CartSession>>([])

	const getCartSessions = async () => {
		try {
			const response = await $fetch("/api/volunteer/cart/carts")
			cartSessions.value = response.map((cart: any) => ({ publicCode: cart.publicCode, publicIcon: cart.publicIcon }))
		} catch (e) {
			cartSessions.value = []
		}
	}

	const handleCartSessionEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "cartSession.created":
				cartSessions.value.push({ publicCode: event.payload.publicCode, publicIcon: event.payload.publicIcon })
				break
			case "cartSession.removed":
				cartSessions.value = cartSessions.value.filter((cart) => cart.publicCode !== event.payload.publicCode)
				break
		}
	}

	return { cartSessions, getCartSessions, handleCartSessionEvent }
})
