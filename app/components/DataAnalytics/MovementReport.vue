<template>
	<DataAnalyticsShell :title="title">
		<DataAnalyticsToolbar v-model:range="range" v-model:grouping="grouping" />
		<DataAnalyticsChart :eyebrow="eyebrow" :title="chartTitle" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable :title="tableTitle" :columns="columns" :rows="tableRows" :export-href="exportHref" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
const props = defineProps<{ direction: "in" | "out" }>()
type MovementRow = { period: string; category: string; item: string; specificItem: string; quantity: number; sessionName?: string; source?: string }
type MovementResponse = { periodTotals: Record<string, number>; rows: MovementRow[] }

const { range, grouping, query } = useAnalyticsRange()
const endpoint = props.direction === "in" ? "/api/head-admin/data/itemsIn" : "/api/head-admin/data/itemsOut"
const exportEndpoint = props.direction === "in" ? "/api/head-admin/data/itemsInExport" : "/api/head-admin/data/itemsOutExport"
const { data } = await useFetch<MovementResponse>(endpoint, { query, default: () => ({ periodTotals: {}, rows: [] }) })
const movement = computed(() => data.value ?? { periodTotals: {}, rows: [] })
const exportHref = computed(() => {
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(query.value)) {
		if (value != null && value !== "") {
			params.set(key, String(value))
		}
	}

	const suffix = params.toString()
	return suffix ? `${exportEndpoint}?${suffix}` : exportEndpoint
})
const isIncoming = computed(() => props.direction === "in")
const title = computed(() => (isIncoming.value ? "Items Received" : "Items Distributed"))
const eyebrow = computed(() => (isIncoming.value ? "Inventory intake" : "Student orders"))
const chartTitle = computed(() => (isIncoming.value ? "Items received over time" : "Items distributed over time"))
const tableTitle = computed(() => (isIncoming.value ? "Received item details" : "Distributed item details"))

const tableRows = computed(() => movement.value.rows)
const columns = computed(() =>
	isIncoming.value
		? [
				{ key: "period", label: "Period" },
				{ key: "sessionName", label: "Session" },
				{ key: "source", label: "Source" },
				{ key: "category", label: "Category" },
				{ key: "item", label: "Item" },
				{ key: "specificItem", label: "Specific Item" },
				{ key: "quantity", label: "Quantity" },
			]
		: [
				{ key: "period", label: "Period" },
				{ key: "category", label: "Category" },
				{ key: "item", label: "Item" },
				{ key: "specificItem", label: "Specific Item" },
				{ key: "quantity", label: "Quantity" },
			]
)

const periodTotals = computed(() => Object.entries(movement.value.periodTotals).map(([period, quantity]) => ({ period, quantity })))
const chartLabels = computed(() => periodTotals.value.map((row) => row.period))
const chartDatasets = computed(() => [
	{
		label: isIncoming.value ? "Items received" : "Items distributed",
		data: periodTotals.value.map((row) => row.quantity),
		backgroundColor: isIncoming.value ? "#154734" : "#e4701e",
		borderRadius: 6,
	},
])
</script>
