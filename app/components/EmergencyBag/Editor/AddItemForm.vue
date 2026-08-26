<template>
	<div class="flex justify-center">
		<div class="flex w-full max-w-3xl flex-col gap-4">
			<SharedFormCard>
				<template #header>
					<header class="text-xl font-bold">Search Inventory</header>
				</template>

				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search items" class="grow" />
					<UPopover>
						<SharedButtonActionButton icon="i-lucide-sliders-horizontal" button-variant="ghost" action="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleFilters" :items="toggleFilterOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Category</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="categoryFilter" :items="categoryOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Item Labels</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="labelFilter" :items="labelOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Display</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="displayOptions" :items="displayFilterOptions" orientation="vertical" class="w-full pl-2" />
								<SharedTextBase class="w-full pl-2 font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow pl-2" />
							</div>
						</template>
					</UPopover>
				</div>

				<USeparator class="my-4" />

				<div class="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
					<table class="w-full text-sm">
						<thead class="sticky top-0 z-10 bg-gray-50">
							<tr class="border-b border-gray-200">
								<th class="w-10 p-2"></th>
								<th class="p-2 text-left font-semibold">Specific Item</th>
								<th class="p-2 text-left font-semibold">Category</th>
								<th class="p-2 text-right font-semibold">Quantity</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in sortedRows" :key="row.specificItemID" class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
								<td class="p-2 align-top">
									<UCheckbox
										:model-value="isSelected(row.specificItemID)"
										:disabled="row.quantity <= 0 && !isSelected(row.specificItemID)"
										@update:model-value="() => toggleSelect(row)"
									/>
								</td>
								<td class="p-2 align-top">
									<div class="flex items-center gap-2">
										<img
											:src="`/api/public/image/${row.imgName}`"
											:alt="row.productName"
											class="border-border-soft h-10 w-10 shrink-0 rounded-md border object-cover"
										/>
										<div class="min-w-0">
											<SharedTextBase>{{ row.productName }}</SharedTextBase>
											<div v-if="showLabels && row.itemLabels.length" class="mt-1 flex max-w-48 flex-wrap gap-1">
												<SharedLabel v-for="label in row.itemLabels" :key="label.itemLabelName" :label="label.itemLabelName" :color="label.color" />
											</div>
										</div>
									</div>
								</td>
								<td class="p-2 align-top"><SharedTextBaseSecondary>{{ row.categoryName }}</SharedTextBaseSecondary></td>
								<td class="p-2 text-right align-top"><SharedTextBaseSecondary>{{ row.quantity }}</SharedTextBaseSecondary></td>
							</tr>
							<tr v-if="sortedRows.length === 0">
								<td colspan="4" class="p-4 text-center">
									<SharedTextBaseSecondary>No items match the current search and filters</SharedTextBaseSecondary>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</SharedFormCard>

			<SharedFormCard>
				<template #header>
					<header class="text-xl font-bold">Current Bag ({{ bagItems.length }})</header>
				</template>

				<div class="flex flex-col gap-4">
					<div v-if="bagItems.length === 0" class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No items in current bag </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
					</div>
					<DomainCardEmergencyBagItemCard
						v-for="item in bagItems"
						:key="item.specificItemID"
						:name="item.name"
						:product-name="item.productName"
						:img-name="item.imgName"
						:item-i-d="item.specificItemID"
						:item-count="item.count"
						:item-quantity="item.quantity"
						:item-labels="item.itemLabels"
						@increment="increaseItemCount(item.specificItemID)"
						@decrement="decreaseItemCount(item.specificItemID)"
						@remove="removeItemFromBag(item.specificItemID)"
					/>
				</div>
				<div class="flex justify-center">
					<SharedTextBaseSecondary v-if="hasError" class="mt-4 text-sm text-red-500"
						>Please add at least one item to your bag</SharedTextBaseSecondary
					>
				</div>
			</SharedFormCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
type BagItem = {
	specificItemID: string
	count: number
	name: string
	productName: string
	imgName: string
	quantity: number
	itemLabels: string[]
}

type InventoryLabel = { itemLabelName: string; color: string; archived: boolean }

type InventoryItem = {
	itemID: string
	itemName: string
	category: { categoryName: string }
	specificItems: {
		specificItemID: string
		productName: string
		imgName: string
		quantity: number
		itemLabels: InventoryLabel[]
	}[]
}

const props = defineProps<{ items: InventoryItem[] }>()
const bagItems = defineModel<BagItem[]>("bagItems", { required: true })
const hasError = ref(false)

const toggleFilterOptions = ref(["Selected Only", "In Stock"])
const toggleFilters = ref<string[]>([])
const categoryFilter = ref<string[]>([])
const labelFilter = ref<string[]>([])
const displayFilterOptions = ref(["Show Labels"])
const displayOptions = ref<string[]>(["Show Labels"])
const showLabels = computed(() => displayOptions.value.includes("Show Labels"))
const sortOption = ref("Item Name")
const sortOptions = ["Item Name", "Specific Item Name"]

// Preserves quantities for items removed from the bag so re-selecting them restores the prior count.
const countMemory = new Map<string, number>()

watch(
	() => bagItems.value?.length,
	(newLength) => {
		if (newLength > 0) hasError.value = false
	}
)

defineExpose({
	validate: () => {
		hasError.value = !bagItems.value || bagItems.value.length === 0
		return !hasError.value
	},
})

const rows = computed(() =>
	props.items.flatMap((item) =>
		item.specificItems.map((specificItem) => ({
			specificItemID: specificItem.specificItemID,
			itemID: item.itemID,
			itemName: item.itemName,
			itemImgName: item.specificItems[0]?.imgName ?? specificItem.imgName,
			productName: specificItem.productName,
			imgName: specificItem.imgName,
			quantity: Number(specificItem.quantity),
			categoryName: item.category.categoryName,
			itemLabels: specificItem.itemLabels.filter((label) => !label.archived),
		}))
	)
)

const categoryOptions = computed(() => [...new Set(rows.value.map((row) => row.categoryName))].sort())
const labelOptions = computed(() => [...new Set(rows.value.flatMap((row) => row.itemLabels.map((label) => label.itemLabelName)))].sort())

const isSelected = (specificItemID: string) => (bagItems.value ?? []).some((item) => item.specificItemID === specificItemID)

const filteredRows = computed(() =>
	rows.value.filter((row) => {
		const matchesCategory = categoryFilter.value.length === 0 || categoryFilter.value.includes(row.categoryName)
		const matchesLabels = labelFilter.value.length === 0 || row.itemLabels.some((label) => labelFilter.value.includes(label.itemLabelName))
		const matchesInStock = !toggleFilters.value.includes("In Stock") || row.quantity > 0
		const matchesSelected = !toggleFilters.value.includes("Selected Only") || isSelected(row.specificItemID)
		return matchesCategory && matchesLabels && matchesInStock && matchesSelected
	})
)

const { query, filtered: searchedRows } = useFuzzySearch(filteredRows, { searchKeys: ["itemName", "productName", "itemLabels.itemLabelName"] })

const sortedRows = computed(() => {
	const sorted = [...searchedRows.value]
	if (sortOption.value === "Item Name") {
		sorted.sort((a, b) => a.itemName.localeCompare(b.itemName) || a.productName.localeCompare(b.productName))
	} else {
		sorted.sort((a, b) => a.productName.localeCompare(b.productName))
	}
	return sorted
})

const toggleSelect = (row: (typeof rows.value)[number]) => {
	if (isSelected(row.specificItemID)) removeItemFromBag(row.specificItemID)
	else addItemToBag(row)
}

const addItemToBag = (row: (typeof rows.value)[number]) => {
	if (!bagItems.value || row.quantity <= 0) return
	const restoredCount = Math.min(countMemory.get(row.specificItemID) ?? 1, row.quantity)
	bagItems.value.push({
		specificItemID: row.specificItemID,
		count: restoredCount,
		name: row.itemName,
		productName: row.productName,
		imgName: row.imgName,
		quantity: row.quantity,
		itemLabels: row.itemLabels.map((label) => label.itemLabelName),
	})
}

const removeItemFromBag = (specificItemID: string) => {
	if (!bagItems.value) return
	const existing = bagItems.value.find((item) => item.specificItemID === specificItemID)
	if (existing) countMemory.set(specificItemID, existing.count)
	bagItems.value = bagItems.value.filter((item) => item.specificItemID !== specificItemID)
}

const increaseItemCount = (specificItemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bagItem) => bagItem.specificItemID === specificItemID)
	if (item && item.count < item.quantity) item.count++
}

const decreaseItemCount = (specificItemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bagItem) => bagItem.specificItemID === specificItemID)
	if (item && item.count > 1) item.count--
}
</script>
