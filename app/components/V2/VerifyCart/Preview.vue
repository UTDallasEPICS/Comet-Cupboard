<template lang="pug">
div.w-full.h-full.bg-white.drop-shadow-standard.flex.flex-col.p-8.rounded-lg
    span.px-4.text-lg.text-center.mt-2.font-bold {{ cartID }}
    div(v-if="cartID != 'There are no carts currently selected'").md_border-white.md_border-2.h-full.rounded-xl.p-12.align-middle
        div.flex.flex-col.items-center.md_items-start.gap-x-4.gap-y-4.mb-4
            div(v-for="warning in warnings").bg-yellow-warning-v2.w-80.md_w-full.h-20.flex.flex-row.items-center.gap-x-5.rounded-lg.p-2
                ExclamationTriangleIcon.size-12
                p.text-base.font-medium {{ warning }}
        div(style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))").grid.gap-4.justify-items-center
            CategoryItemsGrid(v-for="category in Object.keys(categoryCartItems)" :headingName="category").w-80.my-2
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
        div.flex.flex-col.justify-between.lg_flex-row.mx-8
            div.text-right.lg_text-left.flex.flex-col.justify-end
                div.flex.flex-col.font-sans.font-bold.lg_text-xl
                    span Total Count {{ cartTotalCount }}
                    span Adjusted Total {{ cartAdjustedCount }}
            div.flex.flex-col.lg_w-96
                div.flex.justify-center.lg_justify-end.max-w-md.h-28.lg_h-36.my-4.border.border-2.border-outlining-gray-v2.p-1
                    textarea.w-full(v-model="reason" placeholder="Add a reason") 
                div.flex.flex-row.gap-x-8.justify-end.h-12
                    button(@click="rejectCart").w-36.h-10.bg-decline-red-v2.text-white.rounded-xl.font-sans.font-bold.text-base Decline
                    button(@click="acceptCart").w-36.h-10.bg-utd-green.text-white.rounded-xl.font-sans.font-bold.text-base Accept

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
		body: { cartID: props.cartID, action: "REJECT" },
	})
	emit("update:verified-cart")
	emit("cart-declined", props.cartID)
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT" },
	})
	emit("update:verified-cart")
	emit("cart-accepted", props.cartID)
}

const reason = ref('')
</script>

