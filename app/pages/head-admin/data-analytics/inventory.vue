<template>
	<DataAnalyticsShell title="Current Inventory">
		<DataAnalyticsChart
			eyebrow="Inventory by category"
			title="Current stock levels"
			:labels="chartLabels"
			:datasets="chartDatasets"
			clickable
			@label-click="goToCategory"
		/>
		<DataAnalyticsTable title="Inventory" :columns="columns" :rows="tableRows" export-href="/api/head-admin/data/categoryExport" :row-href="rowHref">
			<template #filters>
				<div class="flex overflow-hidden rounded-md border border-gray-200">
					<SharedButtonActionButton
						v-for="option in granularityOptions"
						:key="option.value"
						:text="option.label"
						action="neutral"
						:button-variant="granularity === option.value ? 'soft' : 'ghost'"
						size="sm"
						class="rounded-none"
						@click="granularity = option.value"
					/>
				</div>
			</template>
		</DataAnalyticsTable>
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type Inventory = Record<string, Record<string, { quantity: number; specificItems: Record<string, number> }>>
const { data } = await useFetch<Inventory>("/api/head-admin/data/category", { default: () => ({}) })
const inventory = computed(() => data.value ?? {})
const categoryTotals = computed(() =>
	Object.entries(inventory.value).map(([category, items]) => ({
		category,
		itemCount: Object.keys(items).length,
		quantity: Object.values(items).reduce((total, item) => total + item.quantity, 0),
	}))
)
const chartLabels = computed(() => categoryTotals.value.map((row) => row.category))
const chartDatasets = computed(() => [
	{ label: "Items in stock", data: categoryTotals.value.map((row) => row.quantity), backgroundColor: "#e4701e", borderRadius: 6 },
])
const goToCategory = (category: string) => navigateTo(`/head-admin/data-analytics/inventory/${encodeURIComponent(category)}`)

const granularityOptions = [
	{ label: "By Category", value: "category" as const },
	{ label: "By Item", value: "item" as const },
	{ label: "By Specific Item", value: "specificItem" as const },
]
const granularity = ref<(typeof granularityOptions)[number]["value"]>("category")

const tableRows = computed(() => {
	if (granularity.value === "category") {
		return categoryTotals.value
	}
	if (granularity.value === "item") {
		return Object.entries(inventory.value).flatMap(([category, items]) =>
			Object.entries(items).map(([item, details]) => ({
				category,
				item,
				specificItemCount: Object.keys(details.specificItems).length,
				quantity: details.quantity,
			}))
		)
	}
	return Object.entries(inventory.value).flatMap(([category, items]) =>
		Object.entries(items).flatMap(([item, details]) =>
			Object.entries(details.specificItems).map(([specificItem, quantity]) => ({ category, item, specificItem, quantity }))
		)
	)
})
const columns = computed(() => {
	if (granularity.value === "category") {
		return [
			{ key: "category", label: "Category" },
			{ key: "itemCount", label: "Item Types" },
			{ key: "quantity", label: "Quantity" },
		]
	}
	if (granularity.value === "item") {
		return [
			{ key: "category", label: "Category" },
			{ key: "item", label: "Item" },
			{ key: "specificItemCount", label: "Specific Item Types" },
			{ key: "quantity", label: "Quantity" },
		]
	}
	return [
		{ key: "category", label: "Category" },
		{ key: "item", label: "Item" },
		{ key: "specificItem", label: "Specific Item" },
		{ key: "quantity", label: "Quantity" },
	]
})
const rowHref = computed(() =>
	granularity.value === "category" ? (row: Record<string, string | number>) => `/head-admin/data-analytics/inventory/${encodeURIComponent(String(row.category))}` : undefined
)
</script>
