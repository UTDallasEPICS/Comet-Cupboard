<template>
	<DataAnalyticsShell title="Demand Trends">
		<DataAnalyticsToolbar v-model:range="range" v-model:grouping="grouping" />
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart eyebrow="Student orders" title="Demand over time" type="line" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable title="Demand breakdown" :columns="columns" :rows="tableRows">
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

type MovementRow = { period: string; category: string; item: string; specificItem: string; quantity: number }
type MovementResponse = { periodTotals: Record<string, number>; rows: MovementRow[] }

const { range, grouping, query } = useAnalyticsRange()
const { data } = await useFetch<MovementResponse>("/api/head-admin/data/itemsOut", { query, default: () => ({ periodTotals: {}, rows: [] }) })
const demand = computed(() => data.value ?? { periodTotals: {}, rows: [] })

const periodTotals = computed(() => Object.entries(demand.value.periodTotals).map(([period, quantity]) => ({ period, quantity })))
const total = computed(() => periodTotals.value.reduce((sum, row) => sum + row.quantity, 0))
const peakPeriod = computed(() => [...periodTotals.value].sort((first, second) => second.quantity - first.quantity)[0])
const changeRate = computed(() => {
	if (periodTotals.value.length < 2) return null
	const previous = periodTotals.value[periodTotals.value.length - 2]!.quantity
	const current = periodTotals.value[periodTotals.value.length - 1]!.quantity
	if (previous === 0) return current === 0 ? 0 : 100
	return Math.round(((current - previous) / previous) * 1000) / 10
})
const changeRateLabel = computed(() => {
	if (changeRate.value === null) return "N/A"
	const sign = changeRate.value > 0 ? "+" : ""
	return `${sign}${changeRate.value}%`
})
const metrics = computed(() => [
	{ label: "Total demand", value: total.value, icon: "i-lucide-trending-up" },
	{
		label: "Average per period",
		value: periodTotals.value.length ? Math.round(total.value / periodTotals.value.length) : 0,
		icon: "i-lucide-chart-bar",
	},
	{ label: "Peak period", value: peakPeriod.value?.period ?? "None", icon: "i-lucide-flame" },
	{ label: "Change rate (vs previous period)", value: changeRateLabel.value, icon: "i-lucide-activity" },
])
const chartLabels = computed(() => periodTotals.value.map((row) => row.period))
const chartDatasets = computed(() => [
	{
		label: "Items distributed",
		data: periodTotals.value.map((row) => row.quantity),
		borderColor: "#e4701e",
		backgroundColor: "rgba(228,112,30,.12)",
		fill: true,
		tension: 0.3,
	},
])

const granularityOptions = [
	{ label: "Category", value: "category" as const },
	{ label: "Item", value: "item" as const },
	{ label: "Specific Item", value: "specificItem" as const },
]
const granularity = ref<(typeof granularityOptions)[number]["value"]>("category")

const categoryTotals = computed(() => {
	const totals: Record<string, number> = {}
	for (const row of demand.value.rows) {
		totals[row.category] = (totals[row.category] ?? 0) + row.quantity
	}
	return totals
})
const itemTotals = computed(() => {
	const totals: Record<string, { category: string; quantity: number }> = {}
	for (const row of demand.value.rows) {
		if (!totals[row.item]) totals[row.item] = { category: row.category, quantity: 0 }
		totals[row.item]!.quantity += row.quantity
	}
	return totals
})
const specificItemTotals = computed(() => {
	const totals: Record<string, { category: string; item: string; specificItem: string; quantity: number }> = {}
	for (const row of demand.value.rows) {
		const key = `${row.item} — ${row.specificItem}`
		if (!totals[key]) totals[key] = { category: row.category, item: row.item, specificItem: row.specificItem, quantity: 0 }
		totals[key]!.quantity += row.quantity
	}
	return totals
})

const share = (quantity: number) => (total.value ? `${Math.round((quantity / total.value) * 1000) / 10}%` : "0%")

const tableRows = computed(() => {
	if (granularity.value === "category") {
		return Object.entries(categoryTotals.value).map(([category, quantity]) => ({ category, quantity, share: share(quantity) }))
	}
	if (granularity.value === "item") {
		return Object.entries(itemTotals.value).map(([item, itemData]) => ({
			category: itemData.category,
			item,
			quantity: itemData.quantity,
			share: share(itemData.quantity),
		}))
	}
	return Object.entries(specificItemTotals.value).map(([, specificItemData]) => ({
		category: specificItemData.category,
		item: specificItemData.item,
		specificItem: specificItemData.specificItem,
		quantity: specificItemData.quantity,
		share: share(specificItemData.quantity),
	}))
})
const columns = computed(() => {
	if (granularity.value === "category") {
		return [
			{ key: "category", label: "Category" },
			{ key: "quantity", label: "Quantity" },
			{ key: "share", label: "Share" },
		]
	}
	if (granularity.value === "item") {
		return [
			{ key: "category", label: "Category" },
			{ key: "item", label: "Item" },
			{ key: "quantity", label: "Quantity" },
			{ key: "share", label: "Share" },
		]
	}
	return [
		{ key: "category", label: "Category" },
		{ key: "item", label: "Item" },
		{ key: "specificItem", label: "Specific Item" },
		{ key: "quantity", label: "Quantity" },
		{ key: "share", label: "Share" },
	]
})
</script>
