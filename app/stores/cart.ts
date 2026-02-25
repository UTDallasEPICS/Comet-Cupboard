interface Item {
	itemID: string
	name: string
	categoryName: string
	imgName: string
	archived: boolean
	createdAt: string
	Deal?: {
		itemID: string
		actualCount: number
		adjustedCount: number
	}
}

interface CartItem {
	itemID: string
	cartID: string
	count: number
	countAdjustment: number
	Item: Item
}

interface Cart {
	cartID: string
	updatedAt: string
	pending: boolean
	CartItems: CartItem[]
}

export const useCartStore = defineStore("cart", () => {
	const cart = ref<Cart | object>({})
	const cartView = ref(false)
	const queueStore = useQueueStore()
	const { queueStatus } = storeToRefs(queueStore)

	const resetCartView = () => {
		cartView.value = false
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

	const handleCartEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "queue.entryApproved":
				if (isEmptyObject(cart.value) && !isEmptyObject(queueStatus.value)) {
					// update cart if in queue and cart is empty, to check if the approved entry is for the current user
					await getCart()
				}
				break
		}
	}

	return { cart, cartView, cartItems, cartTotalCount, cartAdjustedCount, pending, getCart, resetCartView, handleCartEvent }
})
