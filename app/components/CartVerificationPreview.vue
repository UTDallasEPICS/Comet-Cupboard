<template lang="pug">
div.w-full.h-min.flex.flex-col.gap-y-4
	div.h-12.rounded-xl.flex.flex-row.justify-between.bg-cupboard-lg
		span.px-4.text-xl.text-left.my-auto {{ cartID }}
		span(v-if="cartID != 'No cart chosen'").px-4.text-xl.text-right.my-auto QTY: {{ cartAdjustedCount }}
	div(v-if="cartID != 'No cart chosen'").md_border-black.md_border-2.h-full.rounded-xl.drop-shadow-standard.p-4
		div(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").grid.place-items-center.gap-4
			div(v-for="warning in warnings").w-72.h-8.rounded.flex.flex-row.bg-yellow-warning
				ExclamationTriangleIcon.my-auto.ml-1.size-7
				p.ml-1.my-auto {{ warning }}
		div(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").grid.gap-4.justify-items-center.align-middle
			CategoryItemsGrid(v-for="category in Object.keys(categoryCartItems)" :headingName="category").w-72.my-4
				CartVerifyCard(
					v-for="cartItem in categoryCartItems[category]"
					:adjustedQTY="cartItem.adjustedQTY"
					:dealCount="cartItem.dealCount"
					:expiredCount="cartItem.expiredCount"
					:imgName="cartItem.imgName"
					:itemDeal="cartItem.itemDeal ? { actualCount: cartItem.itemDeal.actualCount, adjustedCount: cartItem.itemDeal.adjustedCount } : {}"
					:itemID="cartItem.itemID"
					:name="cartItem.name"
					:totalQTY="cartItem.totalQTY"
				)
		div.flex.flex-row.gap-x-4.justify-center.lg_justify-end.h-12
			button(@click="rejectCart").w-40.bg-red-negative.text-white Decline
			button(@click="acceptCart").w-40.bg-utd-green.text-white Accept
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	cartID: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:verified-cart"])

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
