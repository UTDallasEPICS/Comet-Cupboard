<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-id="itemID" :item-count="itemCount">
		<template #header-actions>
			<UButton icon="i-lucide-x" class="bg-red-500 max-h-5" @click="emit('remove', itemID)" />
		</template>
		<template #body>
			<div class="flex items-center gap-4">
				<UButton class="bg-final-utd-green rounded-2xl text-white hover:bg-green-700" :icon="icons['add']" @click="emit('increment', itemID)" />
				<p>{{ itemCount }}</p>
				<UButton class="bg-final-utd-green rounded-2xl text-white hover:bg-green-700" :icon="icons['subtract']" @click="emit('decrement', itemID)" />
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
	itemDeal : Object
	itemCount : Number
}>()
</script>
