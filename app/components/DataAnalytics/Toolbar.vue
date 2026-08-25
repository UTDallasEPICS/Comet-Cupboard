<template>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<UPopover :content="{ align: 'start' }" :modal="true">
			<SharedButtonActionButton action="neutral" variant="ghost" leading-icon="i-lucide-calendar" class="group data-[state=open]:bg-gray-100">
				{{ dateLabel }}
				<template #trailing><SharedIcon name="i-lucide-chevron-down" class="transition-transform group-data-[state=open]:rotate-180" /></template>
			</SharedButtonActionButton>
			<template #content>
				<div class="flex sm:divide-x sm:divide-gray-200">
					<div class="hidden flex-col sm:flex">
						<SharedButtonActionButton
							v-for="preset in presets"
							:key="preset.label"
							:text="preset.label"
							action="neutral"
							variant="ghost"
							class="rounded-none px-4"
							@click="selectPreset(preset.days)"
						/>
					</div>
					<UCalendar v-model="range" range class="p-2" :number-of-months="2" />
				</div>
			</template>
		</UPopover>
		<USelect
			v-if="showGrouping"
			v-model="grouping"
			:items="['Day', 'Week', 'Month', 'Semester']"
			variant="ghost"
			class="w-28 data-[state=open]:bg-gray-100"
		/>
	</div>
</template>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"

const range = defineModel<any>("range", { required: true })
const grouping = defineModel<string>("grouping")
withDefaults(defineProps<{ showGrouping?: boolean }>(), { showGrouping: true })

const formatter = new DateFormatter("en-US", { dateStyle: "medium" })
const presets = [
	{ label: "Last 7 days", days: 7 },
	{ label: "Last 14 days", days: 14 },
	{ label: "Last 30 days", days: 30 },
	{ label: "Last 90 days", days: 90 },
]
const dateLabel = computed(() => {
	if (!range.value.start || !range.value.end) return "Choose a date range"
	const timezone = getLocalTimeZone()
	return `${formatter.format(range.value.start.toDate(timezone))} - ${formatter.format(range.value.end.toDate(timezone))}`
})
const selectPreset = (days: number) => {
	const end = today(getLocalTimeZone())
	range.value = { start: end.subtract({ days }), end }
}
</script>
