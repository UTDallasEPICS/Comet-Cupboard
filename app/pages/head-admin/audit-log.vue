<template>
	<div>
		<NuxtLayout name="main" title="Audit Log" :back-navigation="{ text: 'Back to Dashboard', to: '/head-admin' }">
			<section>
				<div class="grid gap-2 lg:grid-cols-[minmax(0,1fr)_16rem_auto_auto]">
					<UInput v-model="search" placeholder="Search messages" class="w-full" />
					<div class="flex gap-1">
						<USelect v-model="action" :items="actions" placeholder="All actions" clearable class="min-w-0 grow" />
						<UButton
							v-if="action"
							icon="i-lucide-x"
							color="neutral"
							variant="outline"
							aria-label="Clear action filter"
							@click="action = undefined"
						/>
					</div>
					<UPopover>
						<UButton color="neutral" variant="outline" icon="i-lucide-calendar" :label="dateRangeLabel" />
						<template #content>
							<div class="p-2">
								<div class="flex gap-1">
									<UButton size="sm" color="neutral" variant="outline" label="Past day" @click="applyPreset('day')" />
									<UButton size="sm" color="neutral" variant="outline" label="Past 7 days" @click="applyPreset('week')" />
									<UButton size="sm" color="neutral" variant="outline" label="Past month" @click="applyPreset('month')" />
								</div>
								<UCalendar v-model="dateRange" range :number-of-months="2" class="mt-2" />
							</div>
						</template>
					</UPopover>
					<UButton
						v-if="dateRange?.start"
						icon="i-lucide-x"
						color="neutral"
						variant="outline"
						aria-label="Clear date range"
						@click="dateRange = undefined"
					/>
					<UButton
						:icon="wrapRows ? 'i-lucide-wrap-text' : 'i-lucide-text-cursor-input'"
						color="neutral"
						variant="outline"
						:label="wrapRows ? 'Wrap text' : 'Single-line rows'"
						@click="wrapRows = !wrapRows"
					/>
				</div>
				<UCard class="mt-4 overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr>
								<th class="p-2">Timestamp</th>
								<th class="p-2">Action</th>
								<th class="p-2">Message</th>
								<th class="p-2">User</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="entry in logs" :key="entry.auditLogID" class="border-border-soft border-t">
								<td class="p-2 whitespace-nowrap">{{ formatDate(entry.timestamp) }}</td>
								<td class="p-2 whitespace-nowrap">{{ entry.action }}</td>
								<td class="max-w-0 p-2" :class="wrapRows ? 'whitespace-normal' : 'truncate whitespace-nowrap'">{{ entry.message }}</td>
								<td class="p-2 whitespace-nowrap">{{ entry.userID || "System" }}</td>
							</tr>
						</tbody>
					</table>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"

definePageMeta({ layout: false })

const actions = [
	"INVENTORY_INTAKE_SESSION_CREATED",
	"INVENTORY_INTAKE_SESSION_COMPLETED",
	"VERIFY_CART_APPROVED",
	"VERIFY_CART_REJECTED",
	"EMERGENCY_BAG_CREATED",
	"EMERGENCY_BAG_EDITED",
	"SOURCE_CREATED",
	"SOURCE_EDITED",
	"CATEGORY_CREATED",
	"CATEGORY_EDITED",
	"ITEM_CREATED",
	"ITEM_EDITED",
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
const search = ref("")
const action = ref<string | undefined>()
const dateRange = ref<{ start: any; end: any } | undefined>()
const wrapRows = ref(false)
const timeZone = getLocalTimeZone()
const dateFormatter = new DateFormatter("en-US", { dateStyle: "medium" })
const startDate = computed(() => {
	const start = dateRange.value?.start
	if (!start) return undefined
	const date = start.toDate(timeZone)
	date.setHours(0, 0, 0, 0)
	return date.toISOString()
})
const endDate = computed(() => {
	const end = dateRange.value?.end ?? dateRange.value?.start
	if (!end) return undefined
	const date = end.toDate(timeZone)
	date.setHours(23, 59, 59, 999)
	return date.toISOString()
})
const dateRangeLabel = computed(() => {
	const start = dateRange.value?.start
	if (!start) return "Date range"
	const end = dateRange.value?.end
	const formattedStart = dateFormatter.format(start.toDate(timeZone))
	return end ? `${formattedStart} - ${dateFormatter.format(end.toDate(timeZone))}` : formattedStart
})
const applyPreset = (preset: "day" | "week" | "month") => {
	const end = today(timeZone)
	const start = preset === "day" ? end : preset === "week" ? end.subtract({ days: 6 }) : end.subtract({ months: 1 })
	dateRange.value = { start, end }
}
const { data: logs } = await useFetch("/api/head-admin/audit-logs", {
	query: { search, action, startDate, endDate },
	watch: [search, action, startDate, endDate],
})
const formatDate = (date: string) => new Date(date).toLocaleString()
</script>
