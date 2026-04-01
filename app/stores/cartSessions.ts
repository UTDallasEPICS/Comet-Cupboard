interface CartSession {
	cartID: string
}

export const useCartSessionsStore = defineStore("cartSessions", () => {
	const cartSessions = ref<Array<CartSession>>([])

	const getCartSessions = async () => {
		try {
			const response = await $fetch("/api/volunteer/cart/carts")
			cartSessions.value = response.map((cart: any) => ({ cartID: cart.cartID }))
		} catch (e) {
			cartSessions.value = []
		}
	}

	const handleCartSessionEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "cartSession.created":
				cartSessions.value.push({ cartID: event.payload.cartID })
				break
			case "cartSession.removed":
				cartSessions.value = cartSessions.value.filter((cart) => cart.cartID !== event.payload.cartID)
				break
		}
	}

	return { cartSessions, getCartSessions, handleCartSessionEvent }
})
