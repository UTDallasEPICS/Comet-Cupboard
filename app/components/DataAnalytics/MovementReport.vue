<template>
	<DataAnalyticsShell :title="title">
		<DataAnalyticsToolbar v-model:range="range" v-model:grouping="grouping" />
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart :eyebrow="eyebrow" :title="chartTitle" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable :title="tableTitle" :columns="columns" :rows="tableRows" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
const props = defineProps<{ direction: "in" | "out" }>()
type MovementData = Record<string, Record<string, { total: number; items: Record<string, number> }>>

const { range, grouping, query } = useAnalyticsRange()
const endpoint = props.direction === "in" ? "/api/head-admin/data/itemsIn" : "/api/head-admin/data/itemsOut"
const { data } = await useFetch<MovementData>(endpoint, { query, default: () => ({}) })
const movement = computed(() => data.value ?? {})
const isIncoming = computed(() => props.direction === "in")
const title = computed(() => (isIncoming.value ? "Items Received" : "Items Distributed"))
const eyebrow = computed(() => (isIncoming.value ? "Inventory intake" : "Student orders"))
const chartTitle = computed(() => (isIncoming.value ? "Items received over time" : "Items distributed over time"))
const tableTitle = computed(() => (isIncoming.value ? "Received item details" : "Distributed item details"))
const tableRows = computed(() => Object.entries(movement.value).flatMap(([period, categories]) => Object.entries(categories).flatMap(([category, data]) => Object.entries(data.items).map(([item, quantity]) => ({ period, category, item, quantity })))))
const periodTotals = computed(() => Object.entries(movement.value).map(([period, categories]) => ({ period, quantity: Object.values(categories).reduce((sum, category) => sum + category.total, 0) })))
const total = computed(() => periodTotals.value.reduce((sum, row) => sum + row.quantity, 0))
const metrics = computed(() => [
	{ label: isIncoming.value ? "Items received" : "Items distributed", value: total.value, icon: isIncoming.value ? "i-lucide-package-plus" : "i-lucide-package-minus" },
	{ label: "Periods with activity", value: periodTotals.value.filter((row) => row.quantity > 0).length, icon: "i-lucide-calendar-days" },
	{ label: "Item types", value: new Set(tableRows.value.map((row) => row.item)).size, icon: "i-lucide-package" },
	{ label: "Average per period", value: periodTotals.value.length ? Math.round(total.value / periodTotals.value.length) : 0, icon: "i-lucide-chart-bar" },
])
const chartLabels = computed(() => periodTotals.value.map((row) => row.period))
const chartDatasets = computed(() => [{ label: isIncoming.value ? "Items received" : "Items distributed", data: periodTotals.value.map((row) => row.quantity), backgroundColor: isIncoming.value ? "#154734" : "#e4701e", borderRadius: 6 }])
const columns = [{ key: "period", label: "Period" }, { key: "category", label: "Category" }, { key: "item", label: "Item" }, { key: "quantity", label: "Quantity" }]
</script>