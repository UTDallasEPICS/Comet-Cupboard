<template>
	<UCard
		:class="`${changeCount != 0 ? '' : ''} relative w-full min-w-72 shadow-md`"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />

		<div class="flex flex-row items-center gap-2">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-l-lg border object-cover" />

			<div class="flex w-full flex-col p-2">
				<div class="flex flex-row items-center justify-between">
					<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				</div>

				<div class="flex flex-row items-center gap-2">
					<UBadge :label="`QTY: ${quantity}`" variant="outline" color="neutral" />
					<UBadge :label="changeCount > 0 ? `+${changeCount}` : `${changeCount}`" color="secondary" variant="solid" />
				</div>
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
	quantity: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
})
</script>
