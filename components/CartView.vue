<template lang="pug">
div.w-full.sm_w-80.drop-shadow-standard.bg-white.flex.flex-col.text-xl
	div.relative.h-12.w-full.bg-utd-orange.content-center.z-10
		p.text-3xl.text-center.font-bold.text-white Cart View
		button(@click="resetCartView").absolute.inset-y-0.right-2.remove-button-effects
			XMarkIcon.size-10.fill-white.stroke-white.hover_fill-black.hover_stroke-black
	div.px-5.py-5.h-full.flex.flex-col.gap-y-4.overflow-y-scroll.z-10
		CartItemCard(
			v-for="cartItem in cartItems"
			:key="cartItem"
			@update:cart="getCart"
			:count="cartItem.count"
			:expiredCount="cartItem.expiredCount"
			:imgName="cartItem.Item.imgName"
			:itemID="cartItem.itemID"
			:name="cartItem.Item.name"
			:showExpired="markExpiredItems"
		)
		div.w-full.mt-auto.flex.flex-col.gap-y-2
			div.flex.flex-row.justify-between
				p Total QTY
				p.w-2.text-center {{ cartTotalCount }}
			div.flex.flex-row.justify-between
				p Adjusted QTY
				p.w-2.text-center {{ cartAdjustedCount }}
			div(@click="toggleMarkExpiredItems").flex.flex-row.w-min.cursor-pointer
				div.bg-utd-green.rounded-md.w-6.h-6
					CheckIcon(v-show="markExpiredItems").fill-white.stroke-white.h-6
				p.ml-2.text-nowrap.hover_underline Mark Expired Items
			div(class="h-[1px]").bg-black

			button(v-if="pending" @click="emit('retractCart')").bg-utd-green.text-white.w-full.h-12 Pending Cart...
			button(v-else @click="emit('submitCart')").bg-utd-green.text-white.w-full.h-12 Submit Cart
</template>

<script setup lang="ts">
import { XMarkIcon, CheckIcon } from "@heroicons/vue/24/solid"
import { useCartStore } from "~/stores/cart"
import { storeToRefs } from "pinia"

const store = useCartStore()
const { resetCartView, getCart } = store
const { cartItems, cartTotalCount, cartAdjustedCount, pending } = storeToRefs(store)

const emit = defineEmits(["submitCart", "retractCart"])

const markExpiredItems = ref(false)

const toggleMarkExpiredItems = async () => {
	markExpiredItems.value = !markExpiredItems.value
	// reset all expired counts to 0 because we want users to clearly know if they are marking expired items in cart
	if (!markExpiredItems.value) {
		cartItems.value.forEach((cartItem) => {
			$fetch("/api/cart/cartItem", { method: "POST", body: { itemID: cartItem.itemID, incrementChange: 0, expiredCount: 0 } })
		})
		await getCart()
	}
}

onMounted(async () => {
	await getCart()
})
</script>
