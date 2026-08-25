<template>
	<div>
		<NuxtLayout name="main" title="Past Inventory Intake Session" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<UCard>
					<SharedTextSectionTitle>Past Inventory Intake Session</SharedTextSectionTitle>
					<div class="mt-4 grid gap-3 md:grid-cols-3">
						<UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search session name" class="w-full" />
						<USelect v-model="sourceFilter" :items="sourceOptions" placeholder="All sources" class="w-full" />
						<USelect v-model="timeRange" :items="timeRangeOptions" class="w-full" />
					</div>
					<UPopover class="mt-3">
						<SharedButtonActionButton action="neutral" variant="outline" leading-icon="i-lucide-calendar">{{
							dateRangeLabel
						}}</SharedButtonActionButton>
						<template #content><UCalendar v-model="customDateRange" range :number-of-months="2" class="p-2" /></template>
					</UPopover>
					<SharedTextBaseSecondary class="mt-3"
						>{{ filteredSessions.length }} session{{ filteredSessions.length === 1 ? "" : "s" }}</SharedTextBaseSecondary
					>
					<div class="mt-3 space-y-3">
						<DomainCardInventoryCompletedIntakeSessionCard
							v-for="session in filteredSessions"
							:key="session.completedInventoryIntakeSessionID"
							:session="session"
						/>
						<SharedTextBase v-if="filteredSessions.length === 0" class="py-8 text-center"
							>No past intake sessions match these filters.</SharedTextBase
						>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
type HistoricalSession = {
	completedInventoryIntakeSessionID: string
	inventoryIntakeSessionName: string
	sourceName: string
	intakeDate: string
	notes?: string | null
	completedInventoryIntakeSessionItems: {
		specificItemID: string
		amountChanged: number
		specificItem: { productName: string; item: { itemName: string } }
	}[]
}
const { data: sessions } = await useFetch<HistoricalSession[]>("/api/admin/inventory/intake-sessions/past-intake-sessions")
const searchQuery = ref("")
const sourceFilter = ref("ALL")
const timeRange = ref("ALL")
const customDateRange = ref<{ start: any; end: any } | undefined>()
const dateFormatter = new DateFormatter("en-US", { dateStyle: "medium" })
const timeRangeOptions = [
	{ label: "All time", value: "ALL" },
	{ label: "Last 7 days", value: "7" },
	{ label: "Last 30 days", value: "30" },
	{ label: "Last 90 days", value: "90" },
]
const sourceOptions = computed(() => [
	{ label: "All sources", value: "ALL" },
	...[...new Set((sessions.value ?? []).map((session) => session.sourceName))].map((source) => ({ label: source, value: source })),
])
const filteredSessions = computed(() => {
	const normalizedSearch = searchQuery.value.trim().toLowerCase()
	const presetCutoff = timeRange.value === "ALL" ? null : Date.now() - Number(timeRange.value) * 24 * 60 * 60 * 1000
	const rangeStart = customDateRange.value?.start ? customDateRange.value.start.toDate(getLocalTimeZone()).setHours(0, 0, 0, 0) : null
	const rangeEnd = customDateRange.value?.end ? customDateRange.value.end.toDate(getLocalTimeZone()).setHours(23, 59, 59, 999) : null
	return (sessions.value ?? []).filter((session) => {
		const matchesSearch = !normalizedSearch || session.inventoryIntakeSessionName.toLowerCase().includes(normalizedSearch)
		const matchesSource = sourceFilter.value === "ALL" || session.sourceName === sourceFilter.value
		const sessionTime = new Date(session.intakeDate).getTime()
		const matchesPreset = presetCutoff === null || sessionTime >= presetCutoff
		const matchesCustom = rangeStart === null || rangeEnd === null || (sessionTime >= rangeStart && sessionTime <= rangeEnd)
		return matchesSearch && matchesSource && matchesPreset && matchesCustom
	})
})
const dateRangeLabel = computed(() => {
	const range = customDateRange.value
	if (!range?.start) return "Custom date range"
	const start = dateFormatter.format(range.start.toDate(getLocalTimeZone()))
	return range.end ? `${start} - ${dateFormatter.format(range.end.toDate(getLocalTimeZone()))}` : start
})
</script>
