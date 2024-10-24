<template lang="pug">
div.w-full.h-min.flex.flex-col.gap-y-4
	div.h-12.rounded-xl.drop-shadow-standard.flex.flex-row.justify-between.bg-cupboard-lg
		span.px-4.text-xl.text-left.my-auto {{ cartID }}
		span.px-4.text-xl.text-right.my-auto(v-if="cartID != 'No cart chosen'") QTY: {{ cartAdjustedCount }}
	div.md_border-black.md_border-2.h-full.rounded-xl.drop-shadow-standard.p-4(v-if="cartID != 'No cart chosen'")
		div.grid.place-items-center.gap-4(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))")
			div.w-72.h-8.rounded.flex.flex-row(style="background-color: #FFAB00" v-for="warning in warnings")
				ExclamationTriangleIcon.my-auto.ml-1.size-7
				p.ml-1.my-auto {{ warning }}
		div.my-4.grid.place-items-center.gap-4(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))")
			CartVerifyCard(v-for="cartItem in cartItems" :name="cartItem.name" :imgURL="cartItem.imgURL" :itemID="cartItem.itemID" :totalQTY="cartItem.totalQTY" :dealCount="cartItem.dealCount" :expiredCount="cartItem.expiredCount" :adjustedQTY="cartItem.adjustedQTY")
		div.flex.flex-row.gap-x-4.justify-center.lg_justify-end
			button.button.w-40.bg-red-negative.text-white(@click="rejectCart") Decline
			button.button.w-40.bg-utd-green.text-white(@click="acceptCart") Accept
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

const emit = defineEmits(["update:verified-cart"])

const props = defineProps({
	cartID: {
		type: String,
		required: true,
	},
})

const cartItems = ref([])
const warnings = ref<Array<string>>([])

watch(props, async () => {
	try {
		const cart = await $fetch(`/api/verification/pendingCart?cartID=${props.cartID}`)
		cartItems.value = cart.CartItems.map((cartItem) => {
			const { count: adjustedCount, dealCount } = cartItemCountAdjustment(cartItem)
			return {
				name: cartItem.Item.name,
				imgURL: cartItem.Item.imgURL,
				itemID: cartItem.itemID,
				totalQTY: cartItem.count,
				dealCount: dealCount,
				expiredCount: cartItem.expiredCount,
				adjustedQTY: adjustedCount,
			}
		})
		warnings.value = pendingCartWarnings(cart)
	} catch (e) {
		cartItems.value = []
		warnings.value = []
	}
})

const cartAdjustedCount = computed(() => {
	return cartItems.value
		.map((cartItem) => {
			return cartItem.adjustedQTY
		})
		.reduce((a, b) => a + b, 0)
})

const rejectCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "REJECT" },
	})
	emit("update:verified-cart")
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT" },
	})
	emit("update:verified-cart")
}
</script>
