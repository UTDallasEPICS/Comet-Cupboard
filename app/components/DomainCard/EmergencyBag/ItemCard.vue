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
				<SharedTextBaseSecondary v-if="productName">{{ productName }}</SharedTextBaseSecondary>
				<div v-if="itemLabels.length" class="mt-1 flex flex-wrap gap-1">
					<SharedLabel v-for="label in itemLabels" :key="label" :label="label" />
				</div>
				<div class="flex flex-row items-center justify-between">
					<UBadge :label="`QTY: ${itemQuantity}`" variant="outline" color="neutral" />
				</div>
			</div>
		</div>
		<div class="flex flex-col items-end justify-between gap-2">
			<SharedButtonActionButton
				variant="ghost"
				icon="i-lucide-x"
				class="absolute top-2 right-2 shrink-0"
				action="neutral"
				size="xs"
				@click="emit('remove', itemID)"
			/>
			<SharedIncrementDecrementPill
				class="absolute right-2 bottom-2"
				:count="itemCount"
				:min="1"
				:max="itemQuantity"
				@increment="increment"
				@decrement="decrement"
			/>
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
	itemQuantity: number
	itemLabels: string[]
}>()

function increment() {
	emit("increment", props.itemID)
}

function decrement() {
	emit("decrement", props.itemID)
}
</script>
