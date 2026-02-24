<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/volunteer/inventory' }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">Edit {{ currentCategory }} Items</SharedTextSectionTitle>
			<div class="mx-auto flex w-full flex-row gap-4 sm:items-center sm:justify-start">
				<USelectMenu
					v-model:search-term="searchQuery"
					:items="filteredItemsNames"
					ignore-filter
					icon="material-symbols:search"
					placeholder="Search items"
					class="grow"
				/>
				<SharedButtonPositiveAction text="+ Add" :to="`/volunteer/inventory/${currentCategory}/add`" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filteredItems" :key="item.itemID">
					<InventoryItemCard
						:change-count="inventoryStore.changes[item.itemID]?.newCount - inventoryStore.changes[item.itemID]?.oldCount || 0"
						:current-count="item.quantity"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.itemID"
						:name="item.name"
						@change-amount-update="updateItemChangeAmount"
					/>
				</li>
			</ul>
		</section>

		<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
			<SharedButtonPositiveAction v-if="Object.keys(inventoryStore.changes || {}).length === 0" text="No Changes" disabled />
			<SharedButtonPositiveAction v-else text="Review Changes" @click="navigateTo(`/volunteer/inventory/${currentCategory}/review-changes`)" />
		</footer>
	</UContainer>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

const searchQuery = ref("")
const route = useRoute()
const currentCategory = route.params.category as string
const inventoryStore = useInventoryStore()

const { data: items } = await useFetch("/api/student/inventory/items")

const categoryItems = computed(() => {
	return (
		items.value?.filter((item) => {
			const itemCategory = item.categoryName?.trim().toLowerCase() || ""
			const currentCategoryLower = currentCategory?.trim().toLowerCase() || ""
			return itemCategory.includes(currentCategoryLower)
		}) || []
	)
})

const filteredItems = computed(() => {
	if (!categoryItems.value) return []

	// Sort by search
	const term = searchQuery.value.trim()
	let filtered: typeof categoryItems.value = []

	if (!term) {
		// Nothing searched, show all
		filtered = [...categoryItems.value]
	} else {
		const fuse = new Fuse(categoryItems.value, {
			keys: ["name"],
			threshold: 0.6,
		})
		filtered = fuse.search(term).map((r) => r.item)
	}

	return filtered
})

const filteredItemsNames = computed(() => filteredItems.value.map((item) => item.name))

const updateItemChangeAmount = (itemID: string, amountChange: number) => {
	const item = items.value?.find((i) => i.itemID === itemID)
	if (!item) return

	const existingChange = inventoryStore.changes[itemID]
	const oldCount = item.quantity
	const currentNewCount = existingChange?.newCount ?? oldCount
	const newCount = currentNewCount + amountChange

	if (newCount === oldCount) {
		inventoryStore.removeItem(itemID)
		return
	}

	inventoryStore.updateItemCount({
		id: itemID,
		oldCount,
		newCount,
		name: item.name,
		imgName: item.imgName,
	})
}
</script>
