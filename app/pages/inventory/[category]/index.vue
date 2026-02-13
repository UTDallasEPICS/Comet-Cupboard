<template>
	<div class="p-4">
		<SharedButtonNavigateBack text="Back to Categories" @click="navigateTo('/inventory')" />
		<h1 class="text-center">{{ currentCategory || "Category" }}</h1>
		<div class="w-full max-w-xl">
			<div class="mt-6 flex w-full flex-col items-start gap-y-2">
				<div class="flex w-full justify-between gap-x-2">
					<USelectMenu
						v-model:search-term="searchTerm"
						:items="categoryItems"
						ignore-filter
						icon="material-symbols:search"
						placeholder="Search items"
					/>
					<SharedButtonPositiveAction text="+ Add" @click="goToAddPage" />
				</div>
			</div>
		</div>
		<div class="mx-auto grid w-full max-w-437.5 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
			<InventoryItemCard
				v-for="item in filteredCategoryItems"
				:key="item.itemID"
				:change-count="inventoryStore.changes[item.itemID]?.newCount - inventoryStore.changes[item.itemID]?.oldCount || 0"
				:current-count="item.quantity"
				:img-name="item.imgName"
				:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
				:item-i-d="item.itemID"
				:item-name="item.name"
				@change-amount-update="updateItemChangeAmount"
			/>
		</div>
		<div class="sticky right-4 bottom-8 z-20 flex justify-end space-x-2 sm:ml-auto">
			<SharedButtonPositiveAction v-if="Object.keys(inventoryStore.changes || {}).length === 0" text="No Changes" disabled />
			<SharedButtonPositiveAction v-else text="Review Changes" @click="goToReviewPage" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

const searchTerm = ref("")
const route = useRoute()
const currentCategory = computed(() => route.params.category)
const inventoryStore = useInventoryStore()
// Allow items to update based on sorting dropdown
const reactiveItems = ref<any[]>([])

const { data: items } = await useFetch("/api/inventory/items", {
	query: { getCounts: true },
})

// Populate reactiveItems
// This basically observes items, and when items first become available the callback runs and copies
// the array into reactiveItems.value
// This allows computed cards to show after filtering
watch(
	items,
	(val) => {
		reactiveItems.value = val || []
	},
	{ immediate: true }
)

// --Page navigations for each button--
// Back Button
const goToCategoriesPage = () => {
	if (inventoryStore.totalChanges > 0) {
		navigateTo(`/inventory/return-verify?category=${currentCategory.value}`)
	} else {
		inventoryStore.resetChanges()
		navigateTo(`/inventory`)
	}
}
// Add Button
const goToAddPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/inventory/${cat}/add`)
}
// Review Changes Button
const goToReviewPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/inventory/${cat}/review-changes`)
}

// Watches reactiveItems and currentCategory, returns only items whose categoryName matches the URL
const categoryItems = computed(() => {
	return reactiveItems.value.filter((item) => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase())
})

const filteredCategoryItems = computed(() => {
	if (!categoryItems.value) return []

	// Sort by search
	const term = searchTerm.value.trim()
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

const updateItemChangeAmount = (itemID: string, amountChange: number) => {
	const item = reactiveItems.value.find((i) => i.itemID === itemID)
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

const getChangeCount = (itemID: string) => {
	const entry = inventoryStore.changes?.[itemID]
	if (!entry) return 0
	const newCount = entry.newCount ?? 0
	const oldCount = entry.oldCount ?? 0
	return newCount - oldCount
}
</script>
