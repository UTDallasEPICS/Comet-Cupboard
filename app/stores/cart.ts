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
		if (cart.value === null || "cartItems" in cart.value === false) {
			return {}
		}
		const categoryName = (cartItem: any) => cartItem.specificItem?.item?.category?.categoryName ?? "Uncategorized"
		const items = [...cart.value.cartItems].sort((a: any, b: any) => {
			const categoryCompare = categoryName(a).localeCompare(categoryName(b))
			if (categoryCompare !== 0) {
				return categoryCompare
			}

			return (a.specificItem?.item?.itemName ?? "").localeCompare(b.specificItem?.item?.itemName ?? "")
		})

		return Object.groupBy(items, categoryName)
	})

	const itemIDtoCartItemMap = computed(() => {
		if (cart.value === null || "cartItems" in cart.value === false) {
			return {}
		}
		return Object.fromEntries(cart.value.cartItems.map((cartItem: any) => [cartItem.specificItemID, cartItem]))
	})

	const cartTotalCount = computed(() => {
		if (cart.value === null || "cartItems" in cart.value === false) {
			return 0
		}
		return (cart.value.cartItems as Array<{ count: number }>)
			.map((cartItem) => {
				return cartItem.count
			})
			.reduce((a: number, b: number) => a + b, 0)
	})

	const cartIsEmpty = computed(() => {
		return cartTotalCount.value === 0
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

	return { cart, cartView, cartIsEmpty, cartTotalCount, pending, getCart, resetCartView, handleCartEvent, categorizedCartItems, itemIDtoCartItemMap }
})
