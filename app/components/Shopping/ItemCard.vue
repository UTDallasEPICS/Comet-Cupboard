<template>
	<div class="drop-shadow-standard relative rounded-xl bg-white px-3" style="min-width: 279px; height: 88px">
		<UBadge v-if="badgeType === 'free'" :label="'Free'" class="absolute top-2 right-2" />
		<UBadge v-else-if="badgeType === 'deal'" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" class="absolute top-2 right-2" />

		<img
			:src="`/api/image/${imgName}`"
			:alt="name"
			class="absolute rounded border border-gray-300 object-cover p-1"
			style="left: 13px; top: 14px; width: 60px; height: 60px"
		/>
		<div
			class="absolute flex h-full items-center text-left break-words text-black"
			style="left: 100px; top: 0; right: 90px; font-size: 15px; line-height: 17px"
		>
			{{ name }}
		</div>

		<SharedButtonPositiveAction text="+ Add" class="absolute right-2 bottom-2 rounded-lg" @click="addToCart" />
	</div>
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
