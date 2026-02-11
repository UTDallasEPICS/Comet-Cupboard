<template>
	<UCard
		class="relative w-72"
		:ui="{
			header: 'p-4 py-2 sm:p-4 sm:py-2',
			body: 'p-4 py-2 sm:p-4 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row justify-between">
				<p class="truncate">
					{{ name }}
				</p>

				<UBadge v-if="badgeType === 'free'" label="Free" class="" />
				<UBadge
					v-else-if="badgeType === 'deal'"
					:label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`"
					class=""
				/>
			</div>
		</template>

		<div class="h-16">
			<img :src="`/api/image/${imgName}`" :alt="name" class="aspect-square h-full border border-black object-cover" />
			<SharedButtonPositiveAction text="+ Add" class="absolute right-2 bottom-2" @click="addToCart" />
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { useCartStore } from "~/stores/cart"

const store = useCartStore()
const { getCart } = store

const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
})

const dealExists = computed(() => {
	return props.itemDeal && "actualCount" in props.itemDeal && "adjustedCount" in props.itemDeal
})

const badgeType = computed(() => {
	if (!dealExists.value) return null
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) return "free"
	return "deal"
})

const addToCart = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await getCart()
}
</script>
