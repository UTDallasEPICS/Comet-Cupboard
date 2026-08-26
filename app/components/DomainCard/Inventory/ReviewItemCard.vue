<template>
	<UCard class="relative w-full min-w-72 overflow-hidden shadow-md" :ui="{ body: 'p-0 sm:p-0' }">
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />

		<div class="flex min-h-24 items-center gap-4 p-4">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover" />
			<div>
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<SharedTextBaseSecondary>{{ changeCount > 0 ? `+${changeCount}` : changeCount }}</SharedTextBaseSecondary>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
})
</script>
