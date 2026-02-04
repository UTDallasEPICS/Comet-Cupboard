<template>
	<div>
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader :pageTitle="currentCategory" class="md:max-w-[600px] md:rounded-b-3xl"></V2SharedHeaderSubheader>
		</div>
		<Suspense>
			<template #default>
				<div class="mt-20">
					<SkeletonDummyTimer />
					<div class="relative z-0 px-4">
						<div v-if="displayRectangleCards" class="mx-auto w-full max-w-xl">
							<!-- page control components (mobile alignment) -->
							<div class="mt-6 flex w-full flex-col items-start">
								<V2SharedNavigateBackButton backTo="Categories" @click="goToCategoriesPage" />
								<div class="md:flex-row flex w-full flex-col items-center gap-2">
									<V2SharedSearchBar v-model="searchTerm" :category-items="categoryItems" />
									<div class="flex items-center gap-2">
										<V2SharedAddButton @click="goToAddPage" />
									</div>
								</div>
							</div>
						</div>
						<div v-if="displaySquareCards" class="w-full max-w-xl">
							<!-- page control components (desktop alignment) -->
							<div v-if="displaySquareCards" class="mt-6 flex w-full flex-col items-start gap-y-2">
								<V2SharedNavigateBackButton backTo="Categories" @click="goToCategoriesPage" />
								<div class="flex w-full justify-between gap-x-2">
									<V2SharedSearchBar v-model="searchTerm" :category-items="categoryItems" class="w-full max-w-sm" />
									<V2SharedAddButton @click="goToAddPage" />
								</div>
							</div>
						</div>
						<!-- Small Screens (Rectangle Cards), width scales and keeps a single column format -->
						<div v-if="displayRectangleCards" class="mx-auto my-4 block flex w-full max-w-xl flex-col items-stretch gap-y-3">
							<V2InventoryItemCardRectangle
								v-for="item in filteredCategoryItems"
								:key="item.itemID"
								@changeAmountUpdate="updateItemChangeAmount"
								@deleteItem="(item) => openDeleteForm(item)"
								@editDeal="(item) => openDealForm(item, category)"
								@editItem="(item) => openEditForm(item, category)"
								:changeCount="inventoryStore.changes[item.itemID]?.newCount - inventoryStore.changes[item.itemID]?.oldCount || 0"
								:currentCount="item.quantity"
								:imgName="item.imgName"
								:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
								:itemID="item.itemID"
								:itemName="item.name"
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
								@changeAmountUpdate="updateItemChangeAmount"
								@deleteItem="(item) => openDeleteForm(item)"
								@editDeal="(item) => openDealForm(item, category)"
								@editItem="(item) => openEditForm(item, category)"
								:changeCount="getChangeCount(item.itemID)"
								:currentCount="item.quantity"
								:imgName="item.imgName"
								:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
								:itemID="item.itemID"
								:itemName="item.name"
							/>
						</div>
						<!-- Submit button -->
						<div class="sm:ml-auto sticky right-4 bottom-8 z-20 flex justify-end space-x-2">
							<button
								v-if="Object.keys(inventoryStore.changes || {}).length === 0"
								disabled
								class="bg-cupboard-dg drop-shadow-standard flex h-12 w-60 items-center justify-center rounded-xl"
							>
								<p class="text-xl font-bold text-white">No Changes</p>
							</button>
							<button
								v-else
								@click="goToReviewPage"
								class="bg-utd-orange drop-shadow-standard flex h-12 w-60 items-center justify-center rounded-xl text-white"
							>
								<p class="text-xl font-bold text-white">Review Changes</p>
							</button>
						</div>
					</div>
				</div>
			</template>
		</Suspense>
	</div>
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"
import { useInventoryStore } from "~/stores/useInventoryStore"
import Fuse from "fuse.js"

const searchTerm = ref("")
const route = useRoute()
const currentCategory = computed(() => route.params.categoryName)
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
watch(items, (val) => {
	reactiveItems.value = val || []
}, { immediate: true })

// --Page navigations for each button--
// Back Button
const goToCategoriesPage = () => {
	if(inventoryStore.totalChanges > 0) {
		navigateTo(`/v2/inventory/return-verify?category=${currentCategory.value}`)
	}
	else {
		inventoryStore.resetChanges()
		navigateTo(`/v2/inventory/category-select`)
	}
}
// Add Button
const goToAddPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/v2/inventory/${cat}/add`)
}
// Review Changes Button
const goToReviewPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/v2/inventory/${cat}/review-changes`)
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
	return reactiveItems.value.filter(
		item => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase()
	)
})

const filteredCategoryItems = computed(() => {
	if(!categoryItems.value) return []

	// Sort by search
	const term = searchTerm.value.trim()
	let filtered: typeof categoryItems.value = []

	if(!term) {
		// Nothing searched, show all
		filtered = [...categoryItems.value]
	} else {
		const fuse = new Fuse(categoryItems.value, {
			keys: ["name"],
			threshold: 0.6,
		})
		filtered = fuse.search(term).map(r => r.item)
	}

	return filtered
})

const updateItemChangeAmount = (itemID: string, amountChange: number) => {
	const item = reactiveItems.value.find(i => i.itemID === itemID)
	if(!item) return

	const existingChange = inventoryStore.changes[itemID]
	const oldCount = item.quantity
	const currentNewCount = existingChange?.newCount ?? oldCount
	const newCount = currentNewCount + amountChange

	if(newCount === oldCount) {
		inventoryStore.removeItem(itemID)
		return
	}

	inventoryStore.updateItemCount({
		id: itemID,
		oldCount,
		newCount,
		name: item.name,
		imgName: item.imgName
	})
}

// Helper to get per-item change count
const getChangeCount = (itemID: string) => {
	const entry = inventoryStore.changes?.[itemID]
	if(!entry) return 0
	const newCount = entry.newCount ?? 0
	const oldCount = entry.oldCount ?? 0
	return newCount - oldCount
}
</script>
