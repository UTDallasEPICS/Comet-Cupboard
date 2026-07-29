export const useCartStore = defineStore("cart", () => {
	const cart = ref<Record<string, any> | null>(null)
	const cartView = ref(false)
	const queueStore = useQueueStore()

	const resetCartView = () => {
		cartView.value = false
	}

	const getCart = async () => {
		try {
			cart.value = await $fetch("/api/student/cart/cart")
		} catch {
			cart.value = null
		}
	}

	const categorizedCartItems = computed(() => {
		if (cart.value === null || "CartItems" in cart.value === false) {
			return {}
		}
		const items = cart.value?.CartItems.sort((a, b) => {
			const categoryCompare = a.Item.categoryName.localeCompare(b.Item.categoryName)
			if (categoryCompare !== 0) {
				return categoryCompare
			}

			return a.Item.name.localeCompare(b.Item.name)
		})

		return Object.groupBy(items, (cartItem) => cartItem.Item.categoryName)
	})

	const cartIsEmpty = computed(() => {
		if (cart.value === null || "CartItems" in cart.value === false) {
			return true
		}
		return categorizedCartItems.value && Object.keys(categorizedCartItems.value).length === 0
	})

	const cartTotalCount = computed(() => {
		if (cart.value === null || "CartItems" in cart.value === false) {
			return 0
		}
		return (cart.value.CartItems as Array<{ count: number }>)
			.map((cartItem) => {
				return cartItem.count
			})
			.reduce((a: number, b: number) => a + b, 0)
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
				if (!cart.value && queueStore.queueStatus) {
					// update cart if in queue and cart is empty, to check if the approved entry is for the current user
					await getCart()
				}
				break
			case "cart.verification.decision":
				await getCart()
				break
		}
	}

	return { cart, cartView, cartIsEmpty, cartTotalCount, pending, getCart, resetCartView, handleCartEvent, categorizedCartItems }
})
