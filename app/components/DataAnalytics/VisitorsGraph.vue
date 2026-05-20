<template>
	<div>
		<div class="flex items-center justify-end">
			<div class="justify-left mr-2 flex flex-col gap-1">
				<p class="text-right text-sm">Time Level</p>
				<USelect v-model="grouping" :items="['Day', 'Week', 'Month', 'Semester']" class="w-28" />
			</div>

			<div class="flex flex-col justify-center gap-1">
				<p class="text-right text-sm">Time Range</p>

				<UInputDate ref="inputDate" v-model="modelValue" range>
					<template #trailing>
						<UPopover :reference="inputDate?.inputsRef[0]?.$el">
							<UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar" aria-label="Select a date range" class="px-0" />

							<template #content>
								<UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
							</template>
						</UPopover>
					</template>
				</UInputDate>
			</div>
		</div>
		<canvas ref="lineContainer"></canvas>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
import { Chart } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { data: user } = await useFetch("/api/head-admin/data/visitor")

const chartContainer = useTemplateRef("lineContainer")

const chart = shallowRef<Chart | null>(null)

const orders = computed(() => {
	return user.value.flatMap((user) =>
		user.Orders.map((order) => ({
			orderID: order.orderID,
			createdAt: new Date(order.createdAt),
			netID: user.netID,
		}))
	)
})

const df = new DateFormatter("en-US", { month: "short", day: "numeric" })
const dfMonth = new DateFormatter("en-US", { month: "short" })
const tz = getLocalTimeZone()

const initialEnd = today(tz)
const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const inputDate = useTemplateRef("inputDate")

const filtered = computed(() => {
	if (!modelValue.value.start || !modelValue.value.end) return []
	const startDate = new Date(modelValue.value.start.toDate(tz))
	startDate.setHours(0, 0, 0)
	const endDate = new Date(modelValue.value.end.toDate(tz))
	endDate.setHours(23, 59, 59)

	return orders.value.filter((order) => {
		const orderDate = new Date(order.createdAt)
		return startDate <= orderDate && orderDate <= endDate
	})
})

console.log('filtered: ',filtered.value)

const grouping = ref("Day")

watch(modelValue, () => {
	if (!modelValue.value.start || !modelValue.value.end) return
	const start = modelValue.value.start.toDate(tz)
	const end = modelValue.value.end.toDate(tz)
	const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

	if (diffDays <= 30) {
		grouping.value = "Day"
	} else if (diffDays <= 90) {
		grouping.value = "Week"
	} else {
		grouping.value = "Month"
	}
})

const semesterFromDate = (date) => {
	const springSemesterStart = new Date(date.getFullYear(), 0)
	const springSemesterEnd = new Date(date.getFullYear(), 4, 31)
	const summerSemesterStart = new Date(date.getFullYear(), 5)
	const summerSemesterEnd = new Date(date.getFullYear(), 7, 24)
	// const fallSemesterStart = new Date(date.getFullYear(), 8)
	// const fallSemesterEnd = new Date(date.getFullYear(), 11, 31)

	let semester

	if (date >= springSemesterStart && date <= springSemesterEnd) {
		semester = "Spring"
	} else if (date >= summerSemesterStart && date <= summerSemesterEnd) {
		semester = "Summer"
	} else {
		semester = "Fall"
	}

	return `${semester} ${date.getFullYear()}`
}

console.log(semesterFromDate(modelValue.value.start.toDate(tz)))

const countedDates = computed(() => {
	if (!modelValue.value.start || !modelValue.value.end) return { total: {}, uniqueVisitors: {} }
	const dateCount: Record<string, number> = {}
	const uniqueVisitors: Record<string, Set<string>> = {}

	const currentDate = new Date(modelValue.value.start.toDate(tz))
	currentDate.setHours(0, 0, 0)

	const endDate = new Date(modelValue.value.end.toDate(tz))
	endDate.setHours(0, 0, 0)

	if (grouping.value === "Day") {
		while (currentDate <= endDate) {
			const dateKey = currentDate.toLocaleDateString("en-US")
			dateCount[dateKey] = 0

			currentDate.setDate(currentDate.getDate() + 1)
		}

		for (const order of filtered.value) {
			const dateKey = new Date(order.createdAt).toLocaleDateString("en-US")

			if (dateKey in dateCount) {
				dateCount[dateKey] += 1
			}
		}
	} else if (grouping.value === "Week") {
		while (currentDate <= endDate) {
			const weekStart = new Date(currentDate)
			weekStart.setDate(weekStart.getDate() - weekStart.getDay())

			const weekEnd = new Date(weekStart)
			weekEnd.setDate(weekEnd.getDate() + 6)

			const dateKey = `${weekStart.toLocaleDateString("en-US")} - ${weekEnd.toLocaleDateString("en-US")}`

			dateCount[dateKey] = 0

			currentDate.setDate(currentDate.getDate() + 7)
		}

		for (const order of filtered.value) {
			const weekStart = new Date(order.createdAt)
			weekStart.setDate(weekStart.getDate() - weekStart.getDay())

			const weekEnd = new Date(weekStart)
			weekEnd.setDate(weekEnd.getDate() + 6)

			const dateKey = `${weekStart.toLocaleDateString("en-US")} - ${weekEnd.toLocaleDateString("en-US")}`

			if (dateKey in dateCount) {
				dateCount[dateKey] += 1
			}
		}
	} else if (grouping.value === "Month") {
		while (currentDate <= endDate) {
			const dateKey = currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })

			dateCount[dateKey] = 0

			currentDate.setMonth(currentDate.getMonth() + 1)
	}

		for (const order of filtered.value) {
			const dateKey = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })

			if (dateKey in dateCount) {
				dateCount[dateKey] += 1
			}
		}
	} else if (grouping.value === "Semester") {
		for (const order of filtered.value){
			const dateKey = semesterFromDate(new Date(order.createdAt))

			console.log('dateKey: ', dateKey)	
			
			if (!(dateKey in dateCount)) {
				dateCount[dateKey] = 0
			}
			
			dateCount[dateKey] += 1
		}
	}

	// Unique Visitors
	for (const order of filtered.value){
		let dateKey: string

		if (grouping.value === 'Day') {
			dateKey = new Date(order.createdAt).toLocaleDateString("en-US")
			console.log('dateKey: ',dateKey)
		} else if (grouping.value === 'Week'){
			const weekStart = new Date(order.createdAt)
			weekStart.setDate(weekStart.getDate() - weekStart.getDay())

			const weekEnd = new Date(weekStart)
			weekEnd.setDate(weekEnd.getDate() + 6)

			dateKey = `${weekStart.toLocaleDateString("en-US")} - ${weekEnd.toLocaleDateString("en-US")}`
		} else if (grouping.value === "Month") {
			dateKey = new Date(order.createdAt).toLocaleDateString("en-US", {month: "short", year: "numeric"})
		} else {
			dateKey = semesterFromDate(new Date(order.createdAt))
		}

		if (!(dateKey in uniqueVisitors)){
			uniqueVisitors[dateKey] = new Set()
		}
		uniqueVisitors[dateKey].add(order.netID)
	}

	return {
		total: dateCount,
		uniqueVisitors,
	}
})

const uniqueCounts = computed(() => {
	const counts: Record<string, number> = {}

	for (const key in countedDates.value.uniqueVisitors) {
		counts[key] = countedDates.value.uniqueVisitors[key].size
	}

	return counts
})

const formatLabel = (key: string) => {
	if (grouping.value === "Semester") {
		return key
	}
	if (grouping.value === "Week") {
		const [start, end] = key.split(" - ")
		return `${df.format(new Date(start))} - ${df.format(new Date(end))}`
	} else if (grouping.value === "Month") {
		return `${dfMonth.format(new Date(key))}`
	}

	return df.format(new Date(key))
}

const chartPoints = computed(() => {
	return Object.keys(countedDates.value.total).map((key) => ({
		label: formatLabel(key),
		total: countedDates.value.total[key],
		unique: uniqueCounts.value[key] ?? 0,
	}))
})

console.log("chartPoints: ", chartPoints.value)

watch(countedDates, () => {
	if (!chart.value) return

	chart.value.data.labels = chartPoints.value.map((p) => p.label)

	chart.value.data.datasets[0].data = chartPoints.value.map((p) => p.total)

	chart.value.data.datasets[1].data = chartPoints.value.map((p) => p.unique)

	chart.value.update()
})

const totalVisitorDataset = computed(() => {
	return chartPoints.value.map((p) => p.total)
})

const uniqueVisitorDataset = computed(() => {
	return chartPoints.value.map((p) => p.unique)
})

const data = computed(() => {
	return [
		{
			label: "Total Visitors",
			data: totalVisitorDataset.value,
			borderColor: "#e4701e",
		},
		{
			label: "Unique Visitors",
			data: uniqueVisitorDataset.value,
			borderColor: "#154734",
		},
	]
})

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: "line",
		data: {
			labels: chartPoints.value.map((p) => p.label),
			datasets: data.value,
		},
		options: {
			responsive: true,
			interaction: {
				mode: "index",
				intersect: false,
			},
		},
	})
})
</script>
