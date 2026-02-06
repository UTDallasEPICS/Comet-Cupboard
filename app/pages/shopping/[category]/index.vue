<template>
	<div class="p-4">
		<SharedButtonNavigateBack text="Back to Categories" @click="navigateTo('/shopping')" />
		<h1 class="text-center">{{ currentCategory || "Category" }}</h1>
		<div class="mx-auto mb-6 flex w-full max-w-xl flex-col items-center">
			<USelect v-model="sortOption" :items="sortOptions" />

			<USelectMenu
				v-model:search-term="searchQuery"
				:items="filteredItemsNames"
				ignore-filter
				icon="material-symbols:search"
				placeholder="Search items"
			/>
		</div>

		<div class="flex w-full justify-center">
			<div class="max-w-275px flex flex-col items-center">
				<div class="grid grid-cols-1 gap-y-4">
					<ShoppingItemCard
						v-for="item in filteredItems"
						:key="item.itemID"
						type-of-card="SHOPPING"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.itemID"
						:name="item.name"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Fuse from "fuse.js"

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Frequently Selected", "Newest Items"]

const route = useRoute()
const currentCategory = route.params.category as string
const searchQuery = ref("")

const { data: items } = await useFetch("/api/inventory/items", {
	query: { checkAvailability: "true" },
})

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
