export const useCartStore = defineStore("cart", () => {
	const cart = ref<Record<string, any> | null>(null)
	const cartView = ref(false)
	const queueStore = useQueueStore()
	const { queueStatus } = storeToRefs(queueStore)

	const resetCartView = () => {
		cartView.value = false
	}

	const getCart = async () => {
		try {
			cart.value = await $fetch("/api/student/cart/cart")
		} catch (e) {
			cart.value = null
		}
	}

	const cartItems = computed(() => {
		if (cart.value === null || "CartItems" in cart.value === false) {
			return []
		}
		return cart.value.CartItems
	})

	const cartTotalCount = computed(() => {
		if (cart.value === null || "CartItems" in cart.value === false) {
			return 0
		}
		return cart.value.CartItems.map((cartItem) => {
			return cartItem.count
		}).reduce((a, b) => a + b, 0)
	})

	const pending = computed(() => {
		if (cart.value === null || "pending" in cart.value === false) {
			return false
		}
		return cart.value.pending
	})

	const handleCartEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "queue.entryApproved":
				if (!cart.value && queueStatus.value) {
					// update cart if in queue and cart is empty, to check if the approved entry is for the current user
					await getCart()
				}
				break
			case "cart.verification.decision":
				await getCart()
				break
		}
	}

	return { cart, cartView, cartItems, cartTotalCount, pending, getCart, resetCartView, handleCartEvent }
})
