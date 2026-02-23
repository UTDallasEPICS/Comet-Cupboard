<template>
	<UContainer>
		<div v-if="cartItems.length === 0" class="py-12 text-center">
			<SharedTextBase>Your cart is empty</SharedTextBase>
		</div>
		<div v-else>
			<div class="flex w-full max-w-md flex-col items-center gap-4">
				<ShoppingCartItemCard
					v-for="cartItem in cartItems"
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
			<div class="flex justify-center pt-6">
				<SharedButtonPositiveAction text="Proceed to Checkout" @click="proceedToCheckout" />
			</div>
		</div>
	</UContainer>
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
