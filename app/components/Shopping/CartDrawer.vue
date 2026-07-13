<template>
	<UContainer>
		<template v-if="!cartStore.cart">
			<template v-if="queueStore.queueStatus">
				<div class="flex w-full flex-col items-center gap-2">
					<SharedTextBase>Currently waiting in queue{{ loadingDots }}</SharedTextBase>
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
			<template v-else>
				<div class="flex w-full flex-col items-center gap-4">
					<SharedTextBase>You need to join queue before shopping</SharedTextBase>
					<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
		</template>
		<template v-else-if="cartStore.cartItems.length === 0">
			<div class="flex w-full flex-col items-center gap-4">
				<SharedTextBase>Your cart is empty</SharedTextBase>
				<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
				<SharedButtonNavigateTo text="Browse Items" to="/student/shopping" />
			</div>
		</template>
		<template v-else>
			<ul class="flex w-full max-w-md flex-col items-center gap-4">
				<li v-for="cartItem in cartStore.cartItems" :key="cartItem.itemID">
					<ShoppingCartItemCard
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
						@update:cart="cartStore.getCart"
					/>
				</li>
			</ul>

			<div class="flex justify-center pt-6">
				<SharedButtonNavigateTo text="Proceed to Checkout" class="w-48" @click="proceedToCheckout" />
			</div>
		</template>
	</UContainer>
</template>

<script setup lang="ts">
const cartStore = useCartStore()

const queueStore = useQueueStore()

const { loadingDots } = useLoadingDots()

const proceedToCheckout = async () => {
	if (cartStore.cartItems.length === 0) {
		return
	}
	cartStore.resetCartView()
	await navigateTo("/student/shopping/checkout")
}
</script>
