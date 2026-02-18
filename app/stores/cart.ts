export const useCartStore = defineStore("cart", () => {
	const cart = ref({})
	const cartView = ref(false)

	const resetCartView = () => {
		cartView.value = false
	}

	const toggleCartView = () => {
		cartView.value = !cartView.value
	}

	const getCart = async () => {
		try {
			cart.value = await $fetch("/api/student/cart/cart")
			if (!cart.value) {
				cart.value = {}
			}
		} catch (e) {
			cart.value = {}
		}
	}
	getCart()

	const cartItems = computed(() => {
		if ("CartItems" in cart.value === false) {
			return []
		}
		return cart.value.CartItems
	})

	const cartTotalCount = computed(() => {
		if ("CartItems" in cart.value === false) {
			return 0
		}
		return cart.value.CartItems.map((cartItem) => {
			return cartItem.count
		}).reduce((a, b) => a + b, 0)
	})

	const cartAdjustedCount = computed(() => {
		return cartCountAdjustment(cart.value)
	})

	const pending = computed(() => {
		if ("pending" in cart.value) {
			return cart.value.pending
		}
		return false
	})

	// handleEvent(event: AppEvent) {
	// 			if (event.id <= this.lastEventId) return // ignore stale event
	// 			this.lastEventId = event.id

	// 			switch (event.type) {
	// 				case "cart.updated":
	// 					if (event.payload.version <= this.version) return // stale version
	// 					this.$patch(event.payload)
	// 					break

	// 				case "resync.required":
	// 					this.fetchInitial() // snapshot refetch
	// 					break
	// 			}
	// 		},

	return { cart, cartView, cartItems, cartTotalCount, cartAdjustedCount, pending, getCart, toggleCartView, resetCartView }
})
