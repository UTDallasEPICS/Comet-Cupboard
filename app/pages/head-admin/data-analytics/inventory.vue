<template>
	<DataAnalyticsShell title="Current Inventory">
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart eyebrow="Inventory by category" title="Current stock levels" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable title="Inventory by item" :columns="columns" :rows="tableRows" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type Inventory = Record<string, Record<string, number>>
const { data } = await useFetch<Inventory>("/api/head-admin/data/category", { default: () => ({}) })
const inventory = computed(() => data.value ?? {})
const tableRows = computed(() => Object.entries(inventory.value).flatMap(([category, items]) => Object.entries(items).map(([item, quantity]) => ({ category, item, quantity }))))
const categoryTotals = computed(() => Object.entries(inventory.value).map(([category, items]) => ({ category, quantity: Object.values(items).reduce((total, quantity) => total + quantity, 0) })))
const total = computed(() => tableRows.value.reduce((sum, row) => sum + row.quantity, 0))
const metrics = computed(() => [
	{ label: "Items in stock", value: total.value, icon: "i-lucide-boxes" },
	{ label: "Categories", value: categoryTotals.value.length, icon: "i-lucide-tags" },
	{ label: "Item types", value: tableRows.value.length, icon: "i-lucide-package" },
	{ label: "Average per item", value: tableRows.value.length ? Math.round(total.value / tableRows.value.length) : 0, icon: "i-lucide-chart-bar" },
])
const chartLabels = computed(() => categoryTotals.value.map((row) => row.category))
const chartDatasets = computed(() => [{ label: "Items in stock", data: categoryTotals.value.map((row) => row.quantity), backgroundColor: "#e4701e", borderRadius: 6 }])
const columns = [{ key: "category", label: "Category" }, { key: "item", label: "Item" }, { key: "quantity", label: "Quantity" }]
</script>