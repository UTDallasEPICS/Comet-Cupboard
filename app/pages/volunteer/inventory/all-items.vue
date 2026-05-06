<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/volunteer/inventory' }" />

			<UButton 
				icon="i-heroicons-question-mark-circle" 
				color="gray" 
				variant="ghost" 
				label="Take a Tour" 
				@click="startTour" 
			/>

			<SharedTextPageTitle>All Items</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">View Inventory Items</SharedTextSectionTitle>
			<div class="mt-4 flex flex-row justify-end">
				<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="horizontal" />
			</div>
			<div class="mx-auto mt-4 flex w-full flex-row flex-wrap gap-4 sm:items-center sm:justify-start">
				<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
				<USelect v-model="sortOption" :items="sortOptions" class="max-w-md grow" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id = "tour-item-list">
				<li v-for="item in filtered" :key="item.itemID">
					<InventoryItemCard
						:change-count="inventoryChangesItems.find((i) => i.itemID === item.itemID)?.count || 0"
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
	</UContainer>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"; 

const inventoryStore = useInventoryStore()
const { inventoryChangesItems } = storeToRefs(inventoryStore)

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

const sortedItems = computed(() => {
	if (!shownItems.value) {
		return []
	}
	const sorted = [...shownItems.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => b.quantity - a.quantity)
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["name"] })

const { startTour } = AllItemsInventoryTour()

onMounted(() => {
	startTour()
})

</script>
