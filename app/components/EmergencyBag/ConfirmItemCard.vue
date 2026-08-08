<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<div class="flex flex-row items-center gap-2">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-lg border object-cover" />

			<div class="flex w-full flex-col p-2">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
			</div>

			<div class="flex flex-row items-center justify-between px-4">
				<UBadge :label="`x${itemCount}`" variant="outline" color="neutral" />
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
	increment: [itemID: string]
	decrement: [itemID: string]
	remove: [itemID: string]
}>()

const props = defineProps<{
	name: string
	imgName: string
	itemID: string
	itemDeal: Object
	itemCount: Number
}>()
</script>
