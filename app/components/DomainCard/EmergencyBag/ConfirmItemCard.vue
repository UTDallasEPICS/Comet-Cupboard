<template>
	<UCard class="relative w-full overflow-hidden shadow-md" :ui="{ body: 'p-0 sm:p-0' }">
		<div class="relative flex min-h-24 items-center gap-4 p-4">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover" />

			<div class="min-w-0 flex-1">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<SharedTextBaseSecondary v-if="productName">{{ productName }}</SharedTextBaseSecondary>
				<div v-if="itemLabels.length" class="mt-1 flex flex-wrap gap-1">
					<SharedLabel v-for="label in itemLabels" :key="label" :label="label" />
				</div>
			</div>

			<UBadge :label="`x${itemCount}`" variant="outline" color="neutral" class="shrink-0" />
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
	productName?: string
	imgName: string
	itemID: string
	itemCount: number
	itemLabels: string[]
}>()
</script>
