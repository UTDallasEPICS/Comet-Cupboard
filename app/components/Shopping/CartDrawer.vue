<template>
	<UContainer>
		<template v-if="!cart">
			<template v-if="queueStatus">
				<div class="flex w-full flex-col items-center gap-2">
					<SharedTextBase>Currently waiting in queue{{ loadingDots }}</SharedTextBase>
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
			<template v-else>
				<div class="flex w-full flex-col items-center gap-2">
					<SharedTextBase>You need to join queue before shopping</SharedTextBase>
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
		</template>
		<template v-else-if="cartItems.length === 0">
			<div class="flex w-full flex-col items-center gap-2">
				<SharedTextBase>Your cart is empty</SharedTextBase>
				<SharedButtonNavigateTo text="Browse Items" to="/student/shopping" />
			</div>
		</template>
		<template v-else>
			<ul class="flex w-full max-w-md flex-col items-center gap-4">
				<li v-for="cartItem in cartItems" :key="cartItem.itemID">
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
						@update:cart="getCart"
					/>
				</li>
			</ul>

			<div class="flex justify-center pt-6">
				<SharedButtonNavigateTo text="Proceed to Checkout" @click="proceedToCheckout" />
			</div>
		</template>
	</UContainer>
</template>

<script setup lang="ts">
const store = useCartStore()
const { getCart, resetCartView } = store
const { cart } = storeToRefs(store)
const { cartItems } = storeToRefs(store)

const queueStore = useQueueStore()
const { queueStatus } = storeToRefs(queueStore)

const { loadingDots } = useLoadingDots()

const proceedToCheckout = async () => {
	if (cartItems.value.length === 0) {
		return
	}
	resetCartView()
	await navigateTo("/student/shopping/checkout")
}
</script>
