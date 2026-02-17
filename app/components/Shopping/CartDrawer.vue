<template>
	<div class="mt-4 w-full flex-1 overflow-y-auto pb-4">
		<div class="flex flex-col items-center gap-4">
			<div v-for="cartItem in cartItems" :key="cartItem.Item.name" class="relative" style="width: 320px">
				<ShoppingCartItemCard
				class="w-full"
					:key="cartItem.itemID"
					:count="cartItem.count"
					:expired-count="cartItem.expiredCount"
					:img-name="cartItem.Item.imgName"
					:item-i-d="cartItem.itemID"
					:name="cartItem.Item.name"
					:item-deal="
						cartItem.Item.Deal
							? {
									actualCount: cartItem.Item.Deal.actualCount,
									adjustedCount: cartItem.Item.Deal.adjustedCount,
								}
							: {}
					"
					:show-expired="markExpiredItems"
					@update:cart="getCart"
				/>
			</div>
		</div>

		<div v-if="cartItems.length === 0" class="mt-4 text-center text-gray-500">Your cart is empty</div>

		<div class="mt-4 mb-2 flex w-full justify-center">
			<ShoppingCheckoutCount
				:cart-total-count="cartTotalCount"
				:cart-adjusted-count="cartAdjustedCount"
				:mark-expired-items="markExpiredItems"
				@toggle-expired="toggleMarkExpiredItems"
			/>
		</div>

		<div class="mt-2 mb-8 flex w-full justify-center">
			<SharedButtonPositiveAction :text="'Next'" @click="submitCart" />
		</div>
	</div>
</template>

<script setup lang="ts">
const store = useCartStore()
const { getCart, resetCartView } = store
const { cartItems, cartTotalCount, cartAdjustedCount } = storeToRefs(store)

const markExpiredItems = ref(false)


const submitCart = async () => {
	if (cartItems.value.length === 0) return
	resetCartView()
	await navigateTo("/shopping/checkout")
}
</script>
