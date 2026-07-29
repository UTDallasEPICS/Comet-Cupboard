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
		<template v-else-if="cartStore.cartIsEmpty">
			<div class="flex w-full flex-col items-center gap-4">
				<SharedTextBase>Your cart is empty</SharedTextBase>
				<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
				<SharedButtonNavigateTo text="Browse Items" to="/student/shopping" />
			</div>
		</template>
		<template v-else>
			<SharedGroupedCollapsible :groups="cartStore.categorizedCartItems" :get-key="(item) => item.itemID" :default-open="true">
				<template #header="{ group, open }">
					<div class="flex flex-col gap-2">
						<SharedButtonPositiveAction
							:text="group"
							:trailing-icon="icons['chevronDown']"
							block
							class="group w-full rounded-lg"
							:ui="{
								trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
							}"
						/>
					</div>
				</template>

				<template #item="{ item: cartItem }">
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
						:quantity="cartItem.Item.quantity"
						@update:cart="cartStore.getCart"
					/>
				</template>
			</SharedGroupedCollapsible>

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
	if (cartStore.cartIsEmpty) {
		return
	}
	cartStore.resetCartView()
	await navigateTo("/student/shopping/checkout")
}
</script>
