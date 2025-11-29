// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref({
    CartItems: [] as Array<{
      Item: {
        name: string
        categoryName?: string
        Deal?: { actualCount: number; adjustedCount: number }
      }
      count: number
      expiredCount: number
    }>
  })

  const cartView = ref(false)

  const cartTotalCount = computed(() =>
    cart.value.CartItems.reduce((sum, item) => sum + item.count, 0)
  )

  const cartAdjustedCount = computed(() => cartTotalCount.value)

  // ✅ Add item to cart
  function addToCart(item: { name: string; categoryName?: string }) {
    const existing = cart.value.CartItems.find(
      c => c.Item.name === item.name
    )

    if (existing) {
      existing.count++
    } else {
      cart.value.CartItems.push({
        Item: { ...item },
        count: 1,
        expiredCount: 0
      })
    }
  }

  // optional but useful
  function removeFromCart(name: string) {
    cart.value.CartItems = cart.value.CartItems.filter(
      c => c.Item.name !== name
    )
  }

  function toggleCartView() {
    cartView.value = !cartView.value
  }

  return {
    cart,
    cartView,
    cartTotalCount,
    cartAdjustedCount,
    addToCart,
    removeFromCart,
    toggleCartView
  }
})
