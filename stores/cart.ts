import { defineStore } from "pinia"

export const useCartStore = defineStore("cart", () => {
	const cart = ref({})
	const getCart = async () => {
		try {
			cart.value = await $fetch("/api/cart/cart")
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

	return { cart, cartItems, cartTotalCount, cartAdjustedCount, pending, getCart }
})
