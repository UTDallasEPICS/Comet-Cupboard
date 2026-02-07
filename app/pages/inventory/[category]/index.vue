<template>
	<div class="p-4">
		<SharedButtonNavigateBack text="Back to Categories" @click="navigateTo('/inventory')" />
		<h1 class="text-center">{{ currentCategory || "Category" }}</h1>
		<div v-if="displayRectangleCards" class="mx-auto w-full max-w-xl">
			<!-- page control components (mobile alignment) -->
			<div class="mt-6 flex w-full flex-col items-start">
				<div class="flex w-full flex-col items-center gap-2 md:flex-row">
					<USelectMenu
						v-model:search-term="searchTerm"
						:items="categoryItems"
						ignore-filter
						icon="material-symbols:search"
						placeholder="Search items"
					/>
					<div class="flex items-center gap-2">
						<SharedButtonPositiveAction text="+ Add" @click="goToAddPage" />
					</div>
				</div>
			</div>
		</div>
		<div v-if="displaySquareCards" class="w-full max-w-xl">
			<!-- page control components (desktop alignment) -->
			<div v-if="displaySquareCards" class="mt-6 flex w-full flex-col items-start gap-y-2">
				<SharedButtonNavigateBack text="Categories" @click="goToCategoriesPage" />
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
		<!-- Small Screens (Rectangle Cards), width scales and keeps a single column format -->
		<div v-if="displayRectangleCards" class="mx-auto my-4 block flex w-full max-w-xl flex-col items-stretch gap-y-3">
			<V2InventoryItemCardRectangle
				v-for="item in filteredCategoryItems"
				:key="item.itemID"
				:change-count="inventoryStore.changes[item.itemID]?.newCount - inventoryStore.changes[item.itemID]?.oldCount || 0"
				:current-count="item.quantity"
				:img-name="item.imgName"
				:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
				:item-i-d="item.itemID"
				:item-name="item.name"
				@change-amount-update="updateItemChangeAmount"
				@delete-item="(item) => openDeleteForm(item)"
				@edit-deal="(item) => openDealForm(item, category)"
				@edit-item="(item) => openEditForm(item, category)"
			/>
		</div>
		<!-- Large Screens (Square Cards) -->
		<div
			v-if="displaySquareCards"
			class="mx-auto my-4 w-full"
			:style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }"
		>
			<V2InventoryItemCardSquare
				v-for="item in filteredCategoryItems"
				:key="item.itemID"
				:change-count="getChangeCount(item.itemID)"
				:current-count="item.quantity"
				:img-name="item.imgName"
				:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
				:item-i-d="item.itemID"
				:item-name="item.name"
				@change-amount-update="updateItemChangeAmount"
				@delete-item="(item) => openDeleteForm(item)"
				@edit-deal="(item) => openDealForm(item, category)"
				@edit-item="(item) => openEditForm(item, category)"
			/>
		</div>
		<!-- Submit button -->
		<div class="sticky right-4 bottom-8 z-20 flex justify-end space-x-2 sm:ml-auto">
			<button
				v-if="Object.keys(inventoryStore.changes || {}).length === 0"
				disabled
				class="drop-shadow-standard flex h-12 w-60 items-center justify-center rounded-xl"
			>
				<p class="text-white">No Changes</p>
			</button>
			<button v-else class="drop-shadow-standard flex h-12 w-60 items-center justify-center rounded-xl text-white" @click="goToReviewPage">
				<p class="text-white">Review Changes</p>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useInventoryStore } from "~/stores/useInventoryStore"
import Fuse from "fuse.js"

const searchTerm = ref("")
const route = useRoute()
const currentCategory = computed(() => route.params.category)
const inventoryStore = useInventoryStore()
const windowWidth = ref(0)
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

// Determining when to display rectangle cards and square cards
onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
})

// For rectangle cards
const displayRectangleCards = computed(() => windowWidth.value < 1024) // Width is less than 1024
// For square cards
const displaySquareCards = computed(() => windowWidth.value >= 1024) // Width is greater than or equal to 1024

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

// Helper to get per-item change count
const getChangeCount = (itemID: string) => {
	const entry = inventoryStore.changes?.[itemID]
	if (!entry) return 0
	const newCount = entry.newCount ?? 0
	const oldCount = entry.oldCount ?? 0
	return newCount - oldCount
}
</script>
