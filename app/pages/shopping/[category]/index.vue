<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/shopping' }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">Add Items to Your Cart</SharedTextSectionTitle>
			<div class="mx-auto flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
				<USelectMenu
					v-model:search-term="searchQuery"
					:items="filteredItemsNames"
					ignore-filter
					icon="material-symbols:search"
					placeholder="Search items"
					class="grow"
				/>
				<USelect v-model="sortOption" :items="sortOptions" class="max-w-md grow" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filteredItems" :key="item.itemID">
					<ShoppingItemCard
						type-of-card="SHOPPING"
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
