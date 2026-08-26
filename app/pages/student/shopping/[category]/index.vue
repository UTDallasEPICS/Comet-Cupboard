<template>
	<div>
		<NuxtLayout name="main" :title="currentCategory" :back-navigation="{ text: 'Back to Categories', to: '/student/shopping' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search items" class="grow" />
					<UPopover>
						<SharedButtonActionButton icon="i-lucide-sliders-horizontal" button-variant="ghost" action="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />
				<SharedLayoutGrid class="mt-4">
					<li v-for="item in filtered" :key="item.itemID">
						<DomainCardShoppingItemCard
							type-of-card="SHOPPING"
							:item-deal="item.deal ? { actualCount: item.deal.actualCount, adjustedCount: item.deal.adjustedCount } : {}"
							:item-i-d="item.itemID"
							:name="item.itemName"
							:quantity="itemQuantityTotal(item)"
							:specific-items="item.specificItems"
							@add="cartStore.addCartItem"
						/>
					</li>
				</SharedLayoutGrid>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const cartStore = useCartStore()
const route = useRoute()
const currentCategory = route.params.category as string

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "true" },
})

const toggleOptions = ref(["Deal"])
const toggleItems = ref([])
const itemQuantityTotal = (item: { specificItems: Array<{ quantity: string }> }) => {
	return item.specificItems.reduce((sum, si) => sum + Number(si.quantity), 0)
}
const shownItems = computed(() => {
	return items.value.filter((item) => {
		return !toggleItems.value.includes("Deal") || item.deal !== null
	})
})

const categoryItems = computed(() => {
	return (
		shownItems.value?.filter((item) => {
			const itemCategory = item.category?.categoryName?.trim().toLowerCase() || ""
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
		sorted.sort((a, b) => a.itemName.localeCompare(b.itemName))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => itemQuantityTotal(b) - itemQuantityTotal(a))
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["itemName", "specificItems.productName", "specificItems.itemLabels.itemLabelName"] })
</script>
