<template>
	<DataAnalyticsShell title="Current Inventory">
		<SharedButtonActionButton action="navigate-back" text="Back to Inventory" to="/head-admin/data-analytics/inventory" class="w-fit" />
		<DataAnalyticsChart
			eyebrow="Inventory by item"
			:title="`Current stock levels — ${categoryName}`"
			:labels="chartLabels"
			:datasets="chartDatasets"
		/>
		<DataAnalyticsTable title="Inventory by specific item" :columns="columns" :rows="tableRows" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type Inventory = Record<string, Record<string, { quantity: number; specificItems: Record<string, number> }>>

const route = useRoute()
const categoryName = computed(() => decodeURIComponent(String(route.params.category)))

const { data } = await useFetch<Inventory>("/api/head-admin/data/category", { default: () => ({}) })
const items = computed(() => data.value?.[categoryName.value] ?? {})

const itemTotals = computed(() => Object.entries(items.value).map(([item, details]) => ({ item, quantity: details.quantity })))
const tableRows = computed(() =>
	Object.entries(items.value).flatMap(([item, details]) =>
		Object.entries(details.specificItems).map(([specificItem, quantity]) => ({ item, specificItem, quantity }))
	)
)
const chartLabels = computed(() => itemTotals.value.map((row) => row.item))
const chartDatasets = computed(() => [
	{ label: "Items in stock", data: itemTotals.value.map((row) => row.quantity), backgroundColor: "#e4701e", borderRadius: 6 },
])
const columns = [
	{ key: "item", label: "Item" },
	{ key: "specificItem", label: "Specific Item" },
	{ key: "quantity", label: "Quantity" },
]
</script>
