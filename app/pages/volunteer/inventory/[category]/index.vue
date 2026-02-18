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
					v-model:search-term="searchTerm"
					:items="categoryItems"
					ignore-filter
					icon="material-symbols:search"
					placeholder="Search items"
					class="grow"
				/>
				<SharedButtonPositiveAction text="+ Add" :to="`/volunteer/inventory/${currentCategory}/add`" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filteredCategoryItems" :key="item.itemID">
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

		<footer class="sticky right-4 bottom-8 flex justify-end space-x-2 sm:ml-auto">
			<SharedButtonPositiveAction v-if="Object.keys(inventoryStore.changes || {}).length === 0" text="No Changes" disabled />
			<SharedButtonPositiveAction v-else text="Review Changes" @click="goToReviewPage" />
		</footer>
	</UContainer>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

const searchTerm = ref("")
const route = useRoute()
const currentCategory = computed(() => route.params.category)
const inventoryStore = useInventoryStore()
// Allow items to update based on sorting dropdown
const reactiveItems = ref<any[]>([])

const { data: items } = await useFetch("/api/student/inventory/items")

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

// Review Changes Button
const goToReviewPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/volunteer/inventory/${cat}/review-changes`)
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
