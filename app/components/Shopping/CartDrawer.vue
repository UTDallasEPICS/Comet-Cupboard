<template>
	<div class="mt-4 w-full flex-1 overflow-y-auto pb-4">
		<div v-if="cartItems.length === 0" class="mt-4 text-center text-gray-500">Your cart is empty</div>
		<div v-else class="flex flex-col items-center gap-4">
			<div v-for="cartItem in cartItems" :key="cartItem.Item.name" class="relative" style="width: 320px">
				<ShoppingCartItemCard
					:key="cartItem.itemID"
					class="w-full"
					:count="cartItem.count"
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
					@update:cart="getCart"
				/>
			</div>
		</div>

		<div class="mt-2 mb-8 flex w-full justify-center">
			<SharedButtonPositiveAction :text="'Proceed to Checkout'" @click="proceedToCheckout" />
		</div>
	</div>
</template>

<script setup lang="ts">
const store = useCartStore()
const { getCart, resetCartView } = store
const { cartItems } = storeToRefs(store)

const proceedToCheckout = async () => {
	if (cartItems.value.length === 0) {
		return
	}
	resetCartView()
	await navigateTo("/student/shopping/checkout")
}
</script>
