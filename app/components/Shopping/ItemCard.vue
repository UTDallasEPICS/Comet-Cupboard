<template>
	<UChip
		:text="amountInCart"
		:show="amountInCart > 0"
		class="w-full min-w-72"
		:ui="{
			base: 'h-[24px] min-w-[24px] text-[12px]',
		}"
	>
		<UCard
			:class="`${amountInCart > 0 ? 'border-utd-orange' : ''} relative w-full min-w-72 shadow-md`"
			:ui="{
				body: 'p-0 py-0 sm:p-0 sm:py-0',
			}"
		>
			<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />
			<div class="flex flex-row items-center gap-2">
				<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-lg border object-cover" />

				<div class="flex w-full flex-col p-2">
					<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
					<div class="flex flex-row items-center justify-between">
						<UBadge :label="`QTY: ${quantity}`" variant="outline" color="neutral" />
					</div>
				</div>
			</div>
			<SharedButtonPositiveAction text="Add" class="absolute right-2 bottom-2 w-20" @click="addToCart" />
		</UCard>
	</UChip>
</template>

<script lang="ts" setup>
const cartStore = useCartStore()

const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	quantity: { type: Number, default: 0 },
})

const amountInCart = computed(() => {
	if (cartStore.itemIDtoCartItemMap[props.itemID]) {
		return cartStore.itemIDtoCartItemMap[props.itemID].count
	}
	return 0
})

const addToCart = async () => {
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await cartStore.getCart()
}
</script>
