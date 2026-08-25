<template>
	<UCard class="relative w-full min-w-72 overflow-hidden shadow-md" :ui="{ body: 'p-0 sm:p-0' }">
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />
		<div class="flex min-h-24 items-center gap-4 p-4">
			<img
				:src="`/api/public/image/${imgName}`"
				:alt="specificItemName(specificItem)"
				class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover"
			/>

			<div class="min-w-0">
				<SharedTextCardTitle>{{ specificItemName(specificItem) }}</SharedTextCardTitle>
				<SharedTextBaseSecondary>{{ quantity }} available</SharedTextBaseSecondary>
			</div>
		</div>
		<USeparator />
		<div class="flex flex-row items-center justify-end gap-2 p-2">
			<SharedButtonActionButton variant="ghost" color="error" icon="i-lucide-trash-2" size="sm" aria-label="Remove from cart" @click="emit('remove', specificItemID)" />
			<SharedTextBaseSecondary class="text-right">In cart:</SharedTextBaseSecondary>
			<SharedIncrementDecrementPill :count="props.count" :min="1" :max="quantity" @increment="increment" @decrement="decrement" />
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	imgName: { type: String, required: true },
	specificItemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	quantity: { type: Number, required: true },
	count: { type: Number, default: 0 },
	specificItem: { type: Object, default: null },
})

const emit = defineEmits<{
	increment: [specificItemID: string]
	decrement: [specificItemID: string]
	remove: [specificItemID: string]
}>()

const increment = () => {
	emit("increment", props.specificItemID)
}

const decrement = () => {
	if (props.count <= 1) {
		return
	}
	emit("decrement", props.specificItemID)
}

const specificItemName = (specificItem) => {
	if (!specificItem) {
		return ""
	}
	return specificItem.productName == "Default" ? specificItem.item.itemName : specificItem.productName
}
</script>
