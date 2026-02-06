<template>
	<div class="border-outlining-gray-v2 sm:px-16 flex h-min min-h-12 w-full flex-col rounded-lg border bg-white px-4 pt-2">
		<p class="px-2 text-center">{{ cartID }}</p>
		<div v-if="cartID != 'There are no carts currently selected'" class="mt-4 flex h-full flex-col gap-y-4 rounded-xl">
			<div class="flex flex-col items-center gap-x-4 gap-y-4">
				<div v-for="warning in warnings" class="bg-yellow-warning-v2 flex w-full flex-row items-center gap-2 rounded-lg p-2">
					<ExclamationTriangleIcon class="aspect-square max-w-8 min-w-8" />
					<p class="">{{ warning }}</p>
				</div>
			</div>
			<div class="grid justify-items-center gap-4" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))' }">
				<CategoryItemsGrid v-for="category in Object.keys(categoryCartItems)" :headingName="category">
					<V2VerifyCartItemCard
						v-for="cartItem in categoryCartItems[category]"
						:adjustedQTY="cartItem.adjustedQTY"
						:dealCount="cartItem.dealCount"
						:expiredCount="cartItem.expiredCount"
						:imgName="cartItem.imgName"
						:itemDeal="cartItem.itemDeal ? { actualCount: cartItem.itemDeal.actualCount, adjustedCount: cartItem.itemDeal.adjustedCount } : {}"
						:itemID="cartItem.itemID"
						:name="cartItem.name"
						:totalQTY="cartItem.totalQTY"
					/>
				</CategoryItemsGrid>
			</div>
			<div class="md:flex-row sm:items-end flex flex-col items-center gap-4">
				<div class="md:mr-auto flex w-min flex-col">
					<p class="text-right text-nowrap">Total Count {{ cartTotalCount }}</p>
					<p class="text-right text-nowrap">Adjusted Count {{ cartAdjustedCount }}</p>
				</div>
				<div class="border-outlining-gray-v2 h-32 w-full max-w-96 border border-2">
					<textarea placeholder="Add a reason" v-model="reason" class="h-full w-full resize-none"></textarea>
				</div>
			</div>
			<div class="sm:justify-end flex h-12 flex-row justify-center gap-x-4">
				<button @click="rejectCart" class="bg-decline-red-v2 h-10 w-32 rounded-xl text-white">Decline</button>
				<button @click="acceptCart" class="bg-utd-green h-10 w-32 rounded-xl text-white">Accept</button>
			</div>
		</div>
	</div>
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
const reason = ref("")

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
	reason.value = ""
	emit("update:verified-cart")
	emit("cart-declined", props.cartID)
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT", reason: reason.value },
	})
	reason.value = ""
	emit("update:verified-cart")
	emit("cart-accepted", props.cartID)
}
</script>
