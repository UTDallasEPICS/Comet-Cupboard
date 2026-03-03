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
					:icon="icons['search']"
					placeholder="Search items"
					class="grow"
				/>
				<SharedButtonPositiveAction text="+ Add" :to="`/volunteer/inventory/${currentCategory}/add`" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filteredItems" :key="item.itemID">
					<InventoryItemCard
						:change-count="quantityChanges[item.itemID]?.countChange || 0"
						:current-count="item.quantity"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.itemID"
						:name="item.name"
					/>
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

const searchQuery = ref("")
const route = useRoute()
const currentCategory = route.params.category as string
const inventoryStore = useInventoryStore()
const { quantityChanges } = storeToRefs(inventoryStore)

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
</script>
