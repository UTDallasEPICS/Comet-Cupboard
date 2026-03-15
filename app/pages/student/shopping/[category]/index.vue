<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/student/shopping' }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">Add Items to Your Cart</SharedTextSectionTitle>
			<div class="mx-auto flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
				<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
				<USelect v-model="sortOption" :items="sortOptions" class="max-w-md grow" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filtered" :key="item.itemID">
					<ShoppingItemCard
						type-of-card="SHOPPING"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.itemID"
						:name="item.name"
						:quantity="item.quantity"
					/>
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const currentCategory = route.params.category as string

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
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
