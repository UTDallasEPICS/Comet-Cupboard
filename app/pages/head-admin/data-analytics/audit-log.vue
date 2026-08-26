<template>
	<DataAnalyticsShell title="Audit Log">
		<DataAnalyticsToolbar v-model:range="range" :show-grouping="false" />
		<DataAnalyticsMetrics :metrics="metrics" />
		<DataAnalyticsChart eyebrow="Recorded actions" title="Audit activity by day" :labels="chartLabels" :datasets="chartDatasets" />
		<DataAnalyticsTable title="Recent audit records" :columns="columns" :rows="tableRows" :export-href="exportHref" />
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
import { getLocalTimeZone } from "@internationalized/date"

definePageMeta({ layout: false })

type AuditLog = { action: string; message: string; timestamp: string; user: { displayName: string | null } | null }
const { range } = useAnalyticsRange()
const auditQuery = computed(() => ({
	startDate: range.value.start?.toDate(getLocalTimeZone()).toISOString(),
	endDate: range.value.end?.toDate(getLocalTimeZone()).toISOString(),
}))
const exportHref = computed(() => {
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(auditQuery.value)) {
		if (value != null && value !== "") {
			params.set(key, String(value))
		}
	}

	const suffix = params.toString()
	const endpoint = "/api/head-admin/data/auditLogExport"
	return suffix ? `${endpoint}?${suffix}` : endpoint
})
const { data } = await useFetch<AuditLog[]>("/api/head-admin/audit-logs", { query: auditQuery, default: () => [] })
const logs = computed(() => data.value ?? [])
const tableRows = computed(() =>
	logs.value.map((log) => ({
		timestamp: new Date(log.timestamp).toLocaleString(),
		action: log.action,
		user: log.user?.displayName ?? "System",
		message: log.message,
	}))
)
const actionTotals = computed(() =>
	logs.value.reduce<Record<string, number>>((totals, log) => {
		totals[log.action] = (totals[log.action] ?? 0) + 1
		return totals
	}, {})
)
const dailyTotals = computed(() =>
	logs.value.reduce<Record<string, number>>((totals, log) => {
		const day = log.timestamp.slice(0, 10)
		totals[day] = (totals[day] ?? 0) + 1
		return totals
	}, {})
)
const metrics = computed(() => [
	{ label: "Records", value: logs.value.length, icon: "i-lucide-clipboard-list" },
	{ label: "Action types", value: Object.keys(actionTotals.value).length, icon: "i-lucide-list-filter" },
	{
		label: "Most common action",
		value: Object.entries(actionTotals.value).sort((first, second) => second[1] - first[1])[0]?.[0] ?? "None",
		icon: "i-lucide-activity",
	},
	{ label: "Displayed limit", value: 500, icon: "i-lucide-list-end" },
])
const chartLabels = computed(() => Object.keys(dailyTotals.value).sort())
const chartDatasets = computed(() => [
	{ label: "Audit events", data: chartLabels.value.map((day) => dailyTotals.value[day]), backgroundColor: "#e4701e", borderRadius: 6 },
])
const columns = [
	{ key: "timestamp", label: "Timestamp" },
	{ key: "action", label: "Action" },
	{ key: "user", label: "User" },
	{ key: "message", label: "Details" },
]
</script>
