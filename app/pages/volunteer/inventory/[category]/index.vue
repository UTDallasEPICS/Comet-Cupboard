<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/volunteer/inventory' }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">Edit {{ currentCategory }} Items</SharedTextSectionTitle>
			<div class="mx-auto flex w-full flex-row flex-wrap gap-4 sm:items-center sm:justify-start">
				<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
				<USelect v-model="sortOption" :items="sortOptions" class="max-w-md grow" />
				<SharedButtonPositiveAction text="+ Add" :to="`/volunteer/inventory/${currentCategory}/add`" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filtered" :key="item.itemID">
					<InventoryItemCard
						:change-count="inventoryChangesItems.find((i) => i.itemID === item.itemID)?.count || 0"
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
const route = useRoute()
const currentCategory = route.params.category as string
const inventoryStore = useInventoryStore()
const { inventoryChangesItems } = storeToRefs(inventoryStore)

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

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

const sortedItems = computed(() => {
	if (!categoryItems.value) {
		return []
	}
	const sorted = [...categoryItems.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => b.quantity - a.quantity)
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["name"] })
</script>
