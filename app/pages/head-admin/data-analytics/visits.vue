<template>
	<DataAnalyticsShell title="Visitor Activity">
		<DataAnalyticsToolbar v-model:range="range" v-model:grouping="grouping" />
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart eyebrow="Orders placed" title="Visits over time" type="line" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable title="Visitor activity by period" :columns="columns" :rows="tableRows" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type TimeSeries = Record<string, number>
const { range, grouping, query } = useAnalyticsRange()
const { data: totalData } = await useFetch<TimeSeries>("/api/head-admin/data/visitor", { query, default: () => ({}) })
const { data: uniqueData } = await useFetch<TimeSeries>("/api/head-admin/data/uniqueVisits", { query, default: () => ({}) })
const totalVisits = computed(() => totalData.value ?? {})
const uniqueVisits = computed(() => uniqueData.value ?? {})
const chartLabels = computed(() => Object.keys(totalVisits.value))
const tableRows = computed(() =>
	chartLabels.value.map((period) => ({ period, visits: totalVisits.value[period] ?? 0, uniqueVisitors: uniqueVisits.value[period] ?? 0 }))
)
const total = computed(() => tableRows.value.reduce((sum, row) => sum + row.visits, 0))
const unique = computed(() => tableRows.value.reduce((sum, row) => sum + row.uniqueVisitors, 0))
const metrics = computed(() => [
	{ label: "Total visits", value: total.value, icon: "i-lucide-users" },
	{ label: "Unique visits", value: unique.value, icon: "i-lucide-user-round-check" },
	{ label: "Peak visits", value: Math.max(0, ...tableRows.value.map((row) => row.visits)), icon: "i-lucide-chart-no-axes-column" },
	{ label: "Average per period", value: tableRows.value.length ? (total.value / tableRows.value.length).toFixed(1) : 0, icon: "i-lucide-chart-line" },
])
const chartDatasets = computed(() => [
	{
		label: "Total visits",
		data: tableRows.value.map((row) => row.visits),
		borderColor: "#e4701e",
		backgroundColor: "rgba(228,112,30,.12)",
		fill: true,
		tension: 0.3,
	},
	{
		label: "Unique visits",
		data: tableRows.value.map((row) => row.uniqueVisitors),
		borderColor: "#154734",
		backgroundColor: "rgba(21,71,52,.08)",
		fill: true,
		tension: 0.3,
	},
])
const columns = [
	{ key: "period", label: "Period" },
	{ key: "visits", label: "Visits" },
	{ key: "uniqueVisitors", label: "Unique visits" },
]
</script>
