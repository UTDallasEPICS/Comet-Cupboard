<template>
	<UCard>
		<template #header>
			<SharedTextCardTitle>Search Product</SharedTextCardTitle>
		</template>
		<div class="rounded-t-lg bg-gray-100 px-4 py-3">
			<UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search items" variant="outline" class="w-full" />
		</div>
		<div class="h-fit max-h-120 space-y-3 overflow-y-auto px-3 py-3">
			<div v-if="!filteredItems.length" class="py-8 text-center">
				<p class="text-text-soft text-sm">Search results will appear here</p>
			</div>
			<div
				v-for="item in filteredItems"
				:key="item.itemID"
				:class="[
					'flex flex-col items-start justify-between gap-3 rounded p-3 transition sm:flex-row sm:items-center',
					getAvailableQuantity(item.itemID) <= 0 ? 'cursor-not-allowed bg-gray-200 opacity-60 grayscale' : 'bg-gray-100',
				]"
			>
				<img
					v-if="item.imgName && item.categoryName"
					:src="`/api/public/image/${item.imgName}`"
					:alt="item.name"
					class="h-10 w-10 shrink-0 rounded object-cover sm:h-12 sm:w-12"
				/>
				<div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-300 sm:h-12 sm:w-12">
					<span class="text-xs text-gray-500">No Img</span>
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold">{{ item.name }}</p>
					<p class="text-text-soft text-xs">Available: {{ getAvailableQuantity(item.itemID) }} / {{ item.quantity }}</p>
				</div>
				<UButton
					size="sm"
					:disabled="getAvailableQuantity(item.itemID) <= 0"
					variant="solid"
					:ui="{ base: 'bg-utd-green' }"
					@click="emit('add', item)"
					>+ Add</UButton
				>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
	inventoryItems: Array<{
		itemID: string
		name: string
		imgName?: string
		categoryName?: string
		quantity: number
	}> | null
	bagItems: Array<{ itemID: string; count: number }>
	currentBagItems: Array<{ itemID: string; count: number }>
}>()

const emit = defineEmits<{
	add: [item: any]
}>()

const searchQuery = ref("")

const filteredItems = computed(() => {
	if (!props.inventoryItems) return []
	if (!searchQuery.value) return props.inventoryItems
	const query = searchQuery.value.toLowerCase()
	return props.inventoryItems.filter((item) => item.name.toLowerCase().startsWith(query))
})

const getAvailableQuantity = (itemID: string): number => {
	const item = props.inventoryItems?.find((i) => i.itemID === itemID)
	if (!item) return 0
	const newItem = props.bagItems.find((i) => i.itemID === itemID)
	const currentItem = props.currentBagItems.find((i) => i.itemID === itemID)
	return item.quantity - (newItem?.count || 0) - (currentItem?.count || 0)
}

const resetSearch = () => {
	searchQuery.value = ""
}

defineExpose({ resetSearch })
</script>
