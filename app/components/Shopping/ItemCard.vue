<template>
	<UCard
		class="relative min-w-72"
		:ui="{
			header: 'p-2 py-2 sm:p-2 sm:py-2',
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row justify-between px-2">
				<p class="truncate">
					{{ name }}
				</p>

				<UBadge v-if="badgeType === 'free'" label="Free" />
				<UBadge v-else-if="badgeType === 'deal'" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" />
			</div>
		</template>

		<div class="flex h-16 flex-row justify-between">
			<img :src="`/api/image/${imgName}`" :alt="name" class="ml-2 aspect-square h-full border border-black object-cover" />
			<div class="mt-auto">
				<div class="flex flex-row items-center gap-2">
					<p>QTY: 99</p>
					<SharedButtonPositiveAction text="+ Add" @click="addToCart" />
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
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
	await $fetch("/api/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	await getCart()
}
</script>
