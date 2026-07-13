<template>
	<div>
		<NuxtLayout name="main" :title="`${currentCategory}`" :back-navigation="{ text: `Back to Categories`, to: '/volunteer/inventory' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
					<UPopover>
						<UButton :icon="icons['sortFilter']" variant="ghost" color="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full text-center">Sort/Filter Options</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="vertical" />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
							</div>
						</template>
					</UPopover>
					<SharedButtonPositiveAction text="Add" :to="`/volunteer/inventory/${currentCategory}/add`" />
				</div>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="item in filtered" :key="item.itemID">
						<InventoryItemCard
							:change-count="inventoryStore.inventoryChangesItems.find((i) => i.itemID === item.itemID)?.count || 0"
							:current-count="item.quantity"
							:img-name="item.imgName"
							:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:item-i-d="item.itemID"
							:name="item.name"
							:category="item.categoryName"
						/>
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const currentCategory = route.params.category as string

const inventoryStore = useInventoryStore()

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "false", includeArchived: true },
})

const toggleOptions = ref(["Deal", "Archived"])
const toggleItems = ref([])

const shownItems = computed(() => {
	return items.value.filter((item) => {
		return (!toggleItems.value.includes("Deal") || item.Deal !== null) && (!toggleItems.value.includes("Archived") || item.archived === true)
	})
})

const categoryItems = computed(() => {
	return (
		shownItems.value?.filter((item) => {
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
