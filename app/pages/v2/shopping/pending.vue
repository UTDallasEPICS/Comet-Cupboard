<template lang="pug">
//- banner
V2ShoppingOrangeBanner(
  title="Pending Cart"
  :topOffset="80"
)

//- checkout flow status
div.min-h-screen.bg-gray-100.font-montserrat.flex.justify-center
  div.w-full.relative(style="max-width: 320px")

    div(
      ref="checkoutRef"
      class="w-full flex justify-center mt-7"
      :style="{ height: checkoutHeight + 'px' }"
    )
      V2ShoppingCheckoutFlow(:ellipseColors="ellipseColors")

    //- pending cart item display
    div.flex.flex-col.gap-3.mt-3
      V2ShoppingPendingCartItem(
        v-for="(item, index) in cart"
        :key="index"
        :item="item"
      )
      div.text-center.text-gray-500.mt-4(v-if="cart.length === 0") No pending items
    
    //- checkout count display
    div.w-full.flex.flex-col.items-center.mt-6.mb-4
      V2ShoppingCheckoutCount(
        :cartTotalCount="cartTotalCount"
        :cartAdjustedCount="cartAdjustedCount"
        :markExpiredItems="false"
      )
    
    //- cancel button
    div.w-full.flex.justify-center.mb-20(style="position: relative")
      V2ShoppingBasicButton(
        label="Cancel"
        color="#9CA3AF"
        style="width: 320px; height: 40px"
        @click="showCancelConfirm = true"
      )
    
    //- cancel confirmation model
    div.fixed.inset-0.flex.items-center.justify-center.z-50(
      v-if="showCancelConfirm"
      style="background-color: rgba(0, 0, 0, 0.4)"
    )
      div.bg-white.p-6.rounded-xl.text-center(style="width: 280px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)")
        p.text-black.font-bold.mb-4 Are you sure you want to cancel?
        div.flex.justify-around.gap-4
          V2ShoppingBasicButton(
            label="Cancel"
            color="#9CA3AF"
            style="position: relative; width: 110px; height: 40px"
            @click="confirmCancel"
          )
          V2ShoppingBasicButton(
            label="Stay"
            color="#154734"
            style="position: relative; width: 110px; height: 40px"
            @click="showCancelConfirm = false"
          )
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useCartStore } from "@/stores/cart"

const store = useCartStore()
const { cartTotalCount, cartAdjustedCount } = storeToRefs(store)

const cart = ref([])
const checkoutHeight = 50
const ellipseColors = ["#154734", "#E87500", "#4A4A4A"]

const showCancelConfirm = ref(false)

// Block scrolling when modal is open
watch(showCancelConfirm, (val) => {
	document.body.style.overflow = val ? "hidden" : ""
})

// Cancel - go back
const confirmCancel = async () => {
  await $fetch("/api/verification/retractCart", { method: "PUT" })
  await navigateTo("/v2/shopping")
}


onMounted(() => {
	document.body.style.overflow = ""
	const rawCart = store.cart.CartItems || []
	cart.value = rawCart.map((i) => ({
		name: i.Item.name,
		qty: i.count,
		qty2: i.expiredCount || 0,
		badge: i.Item.badge,
		quantity: i.Item.quantity,
		countsAs: i.Item.countsAs,
		imgName: i.Item.imgName || null,
	}))
})
</script>
