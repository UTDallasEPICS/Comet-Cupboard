<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-id="itemID" :item-count="itemCount">
		<template #header-actions>
			<UButton variant="ghost" :icon="icons['close']" class="shrink-0" color="neutral" size="xs" @click="emit('remove', itemID)" />
		</template>
		<template #body>
			<div class="flex items-center gap-4">
				<UButton class="bg-utd-green rounded-2xl text-white hover:bg-green-700" :icon="icons['subtract']" @click="emit('decrement', itemID)" />
				<p>{{ itemCount }} / {{ itemQuantity }}</p>
				<UButton class="bg-utd-green rounded-2xl text-white hover:bg-green-700" :icon="icons['add']" @click="emit('increment', itemID)" />
			</div>
		</template>
	</SharedItemCard>
	<!-- <UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<div class="flex flex-row items-center gap-2">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-lg border object-cover" />

			<div class="flex w-full flex-col p-2">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<div class="flex flex-row items-center justify-between">
					<UBadge :label="`QTY: ${itemQuantity}`" variant="outline" color="neutral" />
				</div>
			</div>
		</div>
		<div class="absolute right-2 bottom-2 flex flex-col items-end justify-between gap-2">
			<UButton variant="ghost" :icon="icons['close']" class="shrink-0 absolute bottom-12" color="neutral" size="xs" @click="emit('remove', itemID)" />
			<SharedIncrementDecrementPill :count="itemCount" :min="1" :max="itemQuantity" @increment="increment" @decrement="decrement" />
		</div>
	</UCard> -->
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
	itemDeal: object
	itemCount: number
	itemQuantity: number
}>()
</script>
