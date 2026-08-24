<template>
	<UContainer>
		<template v-if="!cartStore.cart">
			<template v-if="queueStore.queueStatus">
				<div class="flex w-full flex-col items-center gap-2">
					<SharedTextBase>Currently waiting in queue</SharedTextBase>
					<UProgress :indeterminate="true" class="mt-4" />
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
			<template v-else>
				<div class="flex w-full flex-col items-center gap-4">
					<SharedTextBase>You need to join queue before shopping</SharedTextBase>
					<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
					<SharedButtonNavigateTo text="Go to Queue" to="/student/queue" />
				</div>
			</template>
		</template>
		<template v-else-if="cartStore.cartIsEmpty">
			<div class="flex w-full flex-col items-center gap-4">
				<SharedTextBase>Your cart is empty</SharedTextBase>
				<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
				<SharedButtonNavigateTo text="Browse Items" to="/student/shopping" />
			</div>
		</template>
		<template v-else>
			<UAlert :icon="icons['information']" color="neutral" variant="outline">
				<template #title>
					<SharedTextBase>Friendly reminders!</SharedTextBase>
					<ul class="ml-4 list-disc">
						<li><SharedTextBaseSecondary>Only 1 cart checkout per week.</SharedTextBaseSecondary></li>
						<li>
							<SharedTextBaseSecondary>Only at most 6 total items in your cart after adjustments and deals are applied.</SharedTextBaseSecondary>
						</li>
						<li>
							<SharedTextBaseSecondary>Only at most 1 total item per category after adjustments and deals are applied.</SharedTextBaseSecondary>
						</li>
					</ul>
				</template>
			</UAlert>
			<USeparator class="my-4" />
			<SharedLayoutGroupedCollapsible :groups="cartStore.categorizedCartItems" :get-key="(item) => item.specificItemID" :default-open="true">
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
						:img-name="cartItem.specificItem.imgName"
						:specific-item-i-d="cartItem.specificItemID"
						:specific-item="cartItem.specificItem"
						:item-deal="
							cartItem.specificItem.item.deal
								? {
										actualCount: cartItem.specificItem.item.deal.actualCount,
										adjustedCount: cartItem.specificItem.item.deal.adjustedCount,
									}
								: {}
						"
						:quantity="Number(cartItem.specificItem.quantity)"
						@update:cart="cartStore.getCart"
					/>
				</template>
			</SharedLayoutGroupedCollapsible>

			<div class="flex justify-center pt-6">
				<SharedButtonNavigateTo text="Proceed to Checkout" class="w-48" @click="proceedToCheckout" />
			</div>
		</template>
	</UContainer>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const queueStore = useQueueStore()

const proceedToCheckout = async () => {
	if (cartStore.cartIsEmpty) {
		return
	}
	cartStore.resetCartView()
	await navigateTo("/student/shopping/checkout")
}
</script>
