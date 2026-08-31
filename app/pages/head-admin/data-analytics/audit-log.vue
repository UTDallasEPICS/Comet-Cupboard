<template>
	<DataAnalyticsShell title="Audit Log">
		<DataAnalyticsToolbar v-model:range="range" :show-grouping="false" />
		<DataAnalyticsTable title="Recent audit records" :columns="columns" :rows="tableRows" :export-href="exportHref">
			<template #filters>
				<USelect v-model="actionFilter" :items="actionFilterOptions" placeholder="Filter by action" class="w-56" />
			</template>
		</DataAnalyticsTable>
	</DataAnalyticsShell>
</template>

<script setup lang="ts">
import { getLocalTimeZone } from "@internationalized/date"

definePageMeta({ layout: false })

type AuditLog = { action: string; message: string; timestamp: string; user: { displayName: string | null } | null }
const { range } = useAnalyticsRange()
const actionFilter = ref<string>("All actions")
const auditQuery = computed(() => ({
	startDate: range.value.start?.toDate(getLocalTimeZone()).toISOString(),
	endDate: range.value.end?.toDate(getLocalTimeZone()).toISOString(),
	...(actionFilter.value !== "All actions" ? { action: actionFilter.value } : {}),
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
const actionFilterOptions = [
	"All actions",
	"INVENTORY_INTAKE_SESSION_CREATED",
	"INVENTORY_INTAKE_SESSION_COMPLETED",
	"VERIFY_CART_APPROVED",
	"VERIFY_CART_REJECTED",
	"EMERGENCY_BAG_CREATED",
	"EMERGENCY_BAG_EDITED",
	"EMERGENCY_BAG_LABEL_CREATED",
	"EMERGENCY_BAG_LABEL_EDITED",
	"SOURCE_CREATED",
	"SOURCE_EDITED",
	"CATEGORY_CREATED",
	"CATEGORY_EDITED",
	"ITEM_CREATED",
	"ITEM_EDITED",
	"ITEM_LABEL_CREATED",
	"ITEM_LABEL_EDITED",
	"LOCATION_CREATED",
	"LOCATION_EDITED",
	"TUTORIAL_CREATED",
	"TUTORIAL_EDITED",
	"USER_ROLE_EDITED",
	"ANNOUNCEMENT_CREATED",
	"ANNOUNCEMENT_EDITED",
	"DASHBOARD_LINKS_CREATED",
	"DASHBOARD_LINKS_EDITED",
	"OTHER",
]
const tableRows = computed(() =>
	logs.value.map((log) => ({
		timestamp: new Date(log.timestamp).toLocaleString(),
		action: log.action,
		user: log.user?.displayName ?? "System",
		message: log.message,
	}))
)
const columns = [
	{ key: "timestamp", label: "Timestamp" },
	{ key: "action", label: "Action" },
	{ key: "user", label: "User" },
	{ key: "message", label: "Details" },
]
</script>
