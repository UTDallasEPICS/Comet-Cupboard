<template lang="pug">
div.w-full.h-min.min-h-12.bg-white.border.border-outlining-gray-v2.flex.flex-col.rounded-lg.w-72.pt-2.px-4.sm_px-16
	p.px-2.text-lg.text-center.font-semibold.mb-3 {{ cartID }}
	div(v-if="cartID != 'There are no carts currently selected'").h-full.rounded-xl.flex.flex-col.gap-y-4
		div.flex.flex-col.items-center.gap-x-4.gap-y-4
			div(v-for="warning in warnings").bg-yellow-warning-v2.w-full.flex.flex-row.items-center.rounded-lg.p-2.gap-2
				ExclamationTriangleIcon.min-w-8.max-w-8.aspect-square
				p.text-base.font-medium {{ warning }}
		div(style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))").grid.gap-2.justify-items-center
			CategoryItemsGrid(v-for="category in Object.keys(categoryCartItems)" :headingName="category").my-2
				V2VerifyCartItemCard(
					v-for="cartItem in categoryCartItems[category]"
					:adjustedQTY="cartItem.adjustedQTY"
					:dealCount="cartItem.dealCount"
					:expiredCount="cartItem.expiredCount"
					:imgName="cartItem.imgName"
					:itemDeal="cartItem.itemDeal ? { actualCount: cartItem.itemDeal.actualCount, adjustedCount: cartItem.itemDeal.adjustedCount } : {}"
					:itemID="cartItem.itemID"
					:name="cartItem.name"
					:totalQTY="cartItem.totalQTY"
				).w-full.mb-2
		div.flex.flex-col.md_flex-row.gap-4.items-center.sm_items-end
			div.flex.flex-col.font-sans.font-bold.md_mr-auto.w-min
				p.text-nowrap.text-right Total Count {{ cartTotalCount }}
				p.text-nowrap.text-right Adjusted Total {{ cartAdjustedCount }}
			div.max-w-96.h-32.border.border-2.border-outlining-gray-v2.w-full
				textarea(placeholder="Add a reason" v-model="reason").w-full.h-full.resize-none
		div.flex.flex-row.gap-x-4.justify-center.sm_justify-end.h-12
			button(@click="rejectCart").w-32.h-10.bg-decline-red-v2.text-white.rounded-xl.font-sans.font-bold.text-base Decline
			button(@click="acceptCart").w-32.h-10.bg-utd-green.text-white.rounded-xl.font-sans.font-bold.text-base Accept
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	cartID: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:verified-cart , cart-declined , cart-accepted"])

const { cartID } = toRefs(props)

const { data: cart } = await useFetch("/api/verification/pendingCart", {
	query: { cartID: cartID },
})

const warnings: Array<string> = computed(() => {
	if (!cart || !cart.value) {
		return []
	}
	return pendingCartWarnings(cart.value)
})

const categoryCartItems = computed<object>(() => {
	if (!cart || !cart.value || !cart.value.CartItems) {
		return {}
	}
	const categoryCartItemsGrouped = Object.groupBy(cart.value.CartItems, (cartItem) => {
		return cartItem.Item.categoryName
	})
	Object.keys(categoryCartItemsGrouped).forEach((category) => {
		categoryCartItemsGrouped[category] = categoryCartItemsGrouped[category].map((cartItem) => {
			const { count: adjustedCount, dealCount } = cartItemCountAdjustment(cartItem)
			return {
				name: cartItem.Item.name,
				imgName: cartItem.Item.imgName,
				itemID: cartItem.itemID,
				itemDeal: cartItem.Item.Deal,
				totalQTY: cartItem.count,
				dealCount: dealCount,
				expiredCount: cartItem.expiredCount,
				adjustedQTY: adjustedCount,
			}
		})
	})
	return categoryCartItemsGrouped
})

const cartAdjustedCount = computed(() => {
	let adjCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		adjCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItem.adjustedQTY
			})
			.reduce((a, b) => a + b, 0)
	})
	return adjCount
})

const cartTotalCount = computed(() => {
	let totCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		totCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItem.totalQTY
			})
			.reduce((a, b) => a + b, 0)
	})
	return totCount
})

const rejectCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "REJECT", reason: reason.value },
	})
	emit("update:verified-cart")
	emit("cart-declined", props.cartID)
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT", reason: reason.value },
	})
	emit("update:verified-cart")
	emit("cart-accepted", props.cartID)
}

const reason = ref("")
</script>
