import { getLocalTimeZone, today } from "@internationalized/date"

export const useAnalyticsRange = () => {
	const timezone = getLocalTimeZone()
	const end = today(timezone)
	const range = shallowRef({ start: end.subtract({ days: 14 }), end })
	const grouping = ref("Day")

	const query = computed(() => ({
		timeLevel: grouping.value,
		startDate: range.value.start?.toDate(timezone).toISOString(),
		endDate: range.value.end?.toDate(timezone).toISOString(),
	}))

	return { range, grouping, query }
}