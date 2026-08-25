<template>
	<div>
		<NuxtLayout name="main" title="All Items" :back-navigation="{ text: `Back to Inventory`, to: '/volunteer/inventory' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search items" class="grow" />
					<UPopover>
						<SharedButtonActionButton icon="i-lucide-sliders-horizontal" variant="ghost" color="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Item Labels</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="selectedItemLabels" :items="itemLabelOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />
				<SharedLayoutSectionUCard title="Active Items">
					<ul v-if="shownActiveItems.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="item in shownActiveItems" :key="item.itemID">
							<DomainCardInventoryItemCard
								:specific-items="item.specificItems"
								:change-count="inventoryChangeCount(item)"
								:current-count="itemQuantityTotal(item)"
								:img-name="item.imgName"
								:item-deal="item.deal ? { actualCount: item.deal.actualCount, adjustedCount: item.deal.adjustedCount } : {}"
								:item-i-d="item.itemID"
								:name="item.itemName"
								:category="item.category.categoryName"
							/>
						</li>
					</ul>
					<SharedTextBase v-else class="block text-center">No active items found</SharedTextBase>
				</SharedLayoutSectionUCard>

				<SharedLayoutSectionUCard title="Archived Items" class="mt-4">
					<ul v-if="shownArchivedItems.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="item in shownArchivedItems" :key="item.itemID">
							<DomainCardInventoryItemCard
								:specific-items="item.specificItems"
								:change-count="inventoryChangeCount(item)"
								:current-count="itemQuantityTotal(item)"
								:img-name="item.imgName"
								:item-deal="item.deal ? { actualCount: item.deal.actualCount, adjustedCount: item.deal.adjustedCount } : {}"
								:item-i-d="item.itemID"
								:name="item.itemName"
								:category="item.category.categoryName"
							/>
						</li>
					</ul>
					<SharedTextBase v-else class="block text-center">No archived items found</SharedTextBase>
				</SharedLayoutSectionUCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const inventoryStore = useInventoryStore()

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "false", includeArchived: true },
})

const toggleOptions = ref(["In Stock", "Deal", "Archived"])
const toggleItems = ref([])
const itemLabelOptions = ["Gluten Free", "Halal", "Kosher", "Vegan", "Vegetarian"]
const selectedItemLabels = ref<string[]>([])

const itemQuantityTotal = (item: { specificItems: Array<{ quantity: string }> }) => {
	return item.specificItems.reduce((sum, si) => sum + Number(si.quantity), 0)
}

const inventoryChangeCount = (item: { itemID: string }) => {
	return inventoryStore.inventoryChangesItems
		.filter((change) => change.specificItem.itemID === item.itemID)
		.reduce((sum, change) => sum + change.amountChanged, 0)
}

const shownItems = computed(() => {
	return items.value.filter((item) => {
		return (
			(!toggleItems.value.includes("Deal") || item.deal !== null) &&
			(!toggleItems.value.includes("Archived") || item.archived === true) &&
			(!toggleItems.value.includes("In Stock") || itemQuantityTotal(item) > 0) &&
			(selectedItemLabels.value.length === 0 ||
				item.specificItems.some((product) => product.itemLabels.some((label) => selectedItemLabels.value.includes(label.itemLabelName))))
		)
	})
})

const sortedItems = computed(() => {
	if (!shownItems.value) {
		return []
	}
	const sorted = [...shownItems.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.itemName.localeCompare(b.itemName))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => itemQuantityTotal(b) - itemQuantityTotal(a))
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["itemName", "specificItems.productName", "specificItems.itemLabels.itemLabelName"] })

const shownActiveItems = computed(() => {
	return filtered.value.filter((item) => {
		return item.archived === false
	})
})

const shownArchivedItems = computed(() => {
	return filtered.value.filter((item) => {
		return item.archived === true
	})
})
</script>
