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
	itemQuantity: Number
}>()
</script>
