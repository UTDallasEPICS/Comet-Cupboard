<template>
	<DataAnalyticsShell title="Source Contributions">
		<DataAnalyticsToolbar v-model:range="range" :show-grouping="false" />
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart eyebrow="Items received" title="Contributions by source" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable title="Source contribution details" :columns="columns" :rows="tableRows" :export-href="exportHref" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type Sources = Record<string, Record<string, number>>
const { range, query } = useAnalyticsRange()
const sourceQuery = computed(() => ({
	startDate: query.value.startDate,
	endDate: query.value.endDate,
}))
const exportHref = computed(() => {
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(sourceQuery.value)) {
		if (value != null && value !== "") {
			params.set(key, String(value))
		}
	}

	const suffix = params.toString()
	const endpoint = "/api/head-admin/data/sourceExport"
	return suffix ? `${endpoint}?${suffix}` : endpoint
})
const { data } = await useFetch<Sources>("/api/head-admin/data/source", { query: sourceQuery, default: () => ({}) })
const sourceData = computed(() => data.value ?? {})
const tableRows = computed(() =>
	Object.entries(sourceData.value).flatMap(([source, categories]) =>
		Object.entries(categories).map(([category, quantity]) => ({ source, category, quantity }))
	)
)
const sourceTotals = computed(() =>
	Object.entries(sourceData.value).map(([source, categories]) => ({ source, quantity: Object.values(categories).reduce((sum, value) => sum + value, 0) }))
)
const total = computed(() => sourceTotals.value.reduce((sum, row) => sum + row.quantity, 0))
const metrics = computed(() => [
	{ label: "Items contributed", value: total.value, icon: "i-lucide-package-plus" },
	{ label: "Contributing sources", value: sourceTotals.value.length, icon: "i-lucide-building-2" },
	{ label: "Categories received", value: new Set(tableRows.value.map((row) => row.category)).size, icon: "i-lucide-tags" },
	{ label: "Average per source", value: sourceTotals.value.length ? Math.round(total.value / sourceTotals.value.length) : 0, icon: "i-lucide-chart-bar" },
])
const chartLabels = computed(() => sourceTotals.value.map((row) => row.source))
const chartDatasets = computed(() => [
	{ label: "Items contributed", data: sourceTotals.value.map((row) => row.quantity), backgroundColor: "#154734", borderRadius: 6 },
])
const columns = [
	{ key: "source", label: "Source" },
	{ key: "category", label: "Category" },
	{ key: "quantity", label: "Items" },
]
</script>
