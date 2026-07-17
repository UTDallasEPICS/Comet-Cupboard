<template>
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-4xl font-bold text-black">Items Donated</h1>

			<div class="flex gap-4">
				<div class="flex w-40 flex-col items-center">
					<p class="place-self-start text-xl font-bold">Time Level</p>
					<USelect v-model="grouping" :items="['Day', 'Week', 'Month', 'Semester']" class="w-full" />
				</div>

				<div class="justify-left flex flex-col">
					<p class="place-self-start text-xl font-bold">Time Range</p>
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
		</div>
	</div>

	<UCard class="mt-4 flex min-h-32 w-full items-center justify-center">
		<div class="flex">
			<DataAnalyticsDataCardComponent v-if="!firstDrillDown && !secondDrillDown" title="Total Items Donated" :value="totalItemsDonated" />
			<DataAnalyticsDataCardComponent v-if="!firstDrillDown && !secondDrillDown" title="Total Donation Events" :value="totalDonationEvents" />
			<DataAnalyticsDataCardComponent v-if="!firstDrillDown && !secondDrillDown" title="Largest Donation Count" :value="largestDonationCount" />
			<DataAnalyticsDataCardComponent v-if="!firstDrillDown && !secondDrillDown" title="Average Donation Size" :value="averageDonationSize" />

			<DataAnalyticsDataCardComponent v-if="firstDrillDown || secondDrillDown" title="Total Inventory" :value="totalItemsDonated" />
		</div>
	</UCard>
	<div>
		<div class="mt-10 flex flex-row gap-10">
			<DataAnalyticsVerticalDataComponent title="Top Donated Categories" :items="topDonatedCategories" :count-toggle="true" />
			<div class="min-h-140 w-full min-w-0">
				<button
					v-if="firstDrillDown || secondDrillDown"
					class="absolute m-4 rounded-lg border border-solid px-3 py-1"
					style="cursor: pointer"
					@click="resetChart"
				>
					Back
				</button>
				<UCard class="h-full w-full border px-8">
					<USwitch v-if="firstDrillDown || secondDrillDown" v-model="sortByCount" class="mt-4 justify-self-end" label="Sort by count" />
					<canvas ref="barContainer" class="mt-4" />
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from "chart.js"
import { Chart, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const grouping = ref("Day")
const inputDate = useTemplateRef("inputDate")
const df = new DateFormatter("en-US", { month: "short", day: "numeric" })
const dfMonth = new DateFormatter("en-US", { month: "short" })
const tz = getLocalTimeZone()
const initialEnd = today(tz)

const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const donationData = ref({})
const selectedTimeLevel = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)

const chartContainer = useTemplateRef("barContainer")
const chart = shallowRef(null)

const overviewState = shallowRef<{ labels: string[]; datasets: { label: string; data: number[] }[] }>({
	labels: [],
	datasets: [],
})
const firstDrillDown = ref(false)
const secondDrillDown = ref(false)
const showCount = ref(false)
const sortByCount = ref(false)

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	firstDrillDown.value = false
	secondDrillDown.value = false
	selectedTimeLevel.value = null
	selectedCategory.value = null

	const itemChangesData = await $fetch("/api/head-admin/data/itemsIn", {
		query: {
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	const formatted = {}

	Object.entries(itemChangesData).forEach(([key, value]) => {
		formatted[formatLabel(key)] = value
	})

	donationData.value = formatted

	const dateLabels = Object.keys(donationData.value)

	const restockedQty = Object.values(donationData.value).map((date) => {
		return Object.values(date).reduce((sum, category) => {
			return sum + category.total
		}, 0)
	})

	overviewState.value = {
		labels: dateLabels,
		datasets: [
			{
				label: "Items Donated",
				data: restockedQty,
			},
		],
	}

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.title.text = "Item Donation Count"
	chart.value.update()
}

const currentTimeLevel = computed(() => {
	if (!selectedTimeLevel.value) return {}

	return donationData.value[selectedTimeLevel.value] ?? {}
})

const currentCategoryData = computed(() => {
	if (!selectedCategory.value) return null

	return currentTimeLevel.value[selectedCategory.value] ?? null
})

const totalItemsDonated = computed(() => {
	if (!selectedTimeLevel.value) {
		return Object.values(donationData.value)
			.flatMap((dateData) => Object.values(dateData))
			.reduce((sum, categoryData) => sum + categoryData.total, 0)
	}

	if (!selectedCategory.value) {
		return Object.values(currentTimeLevel.value).reduce((sum, categoryData) => sum + categoryData.total, 0)
	}

	return currentCategoryData.value?.total ?? 0
})

const totalDonationEvents = computed(() => {
	return Object.values(donationData.value).filter((dateData) => Object.values(dateData).some((category) => category.total > 0)).length
})

const largestDonationCount = computed(() => {
	const totals = Object.values(donationData.value).map((dateData) => {
		return Object.values(dateData).reduce((sum, categoryData) => sum + categoryData.total, 0)
	})

	return Math.max(0, ...totals)
})

const averageDonationSize = computed(() => {
	if (totalDonationEvents.value === 0) return 0

	return Math.round(totalItemsDonated.value / totalDonationEvents.value)
})

const categoryTotals = computed(() => {
	if (!selectedTimeLevel.value) {
		return Object.values(donationData.value)
			.flatMap((dateData) => Object.entries(dateData))
			.reduce((acc, [categoryName, categoryData]) => {
				acc[categoryName] = (acc[categoryName] ?? 0) + categoryData.total
				return acc
			}, {})
	}

	if (!selectedCategory.value) {
		return Object.entries(currentTimeLevel.value).reduce((acc, [categoryName, categoryData]) => {
			acc[categoryName] = categoryData.total
			return acc
		}, {})
	}

	return currentCategoryData.value?.items ?? {}
})

const topDonatedCategories = computed(() => {
	if (!totalItemsDonated.value) return []

	return Object.entries(categoryTotals.value)
		.map(([label, count]) => ({
			label,
			count,
			percentage: ((count / totalItemsDonated.value) * 100).toFixed(1),
		}))
		.sort((a, b) => b.count - a.count)
})

watch([modelValue, grouping], () => {
	if (!modelValue.value.start || !modelValue.value.end) return
	updateChart()
})

watch(sortByCount, () => {
	if (firstDrillDown.value && !secondDrillDown.value) {
		showCategoryDrillDownView(selectedTimeLevel.value)
	} else if (secondDrillDown.value) {
		showItemDrillDownView(selectedCategory.value)
	}
})

const showCategoryDrillDownView = (date: string) => {
	if (!chart.value) return

	const categoryData = donationData.value[date]

	const entries = Object.entries(categoryData).map(([label, data]) => ({
		label,
		value: data.total,
	}))

	if (sortByCount.value) {
		entries.sort((a, b) => a.value - b.value)
	}
	const categoryLabels = entries.map((e) => e.label)
	const categoryValues = entries.map((e) => e.value)

	chart.value.data.labels = categoryLabels
	if (grouping.value === "Day" || grouping.value === "Week") {
		chart.value.data.datasets = [
			{
				data: categoryValues,
				backgroundColor: categoryLabels.map((c) => getCategoryColor(c)),
			},
		]
		chart.value.options.plugins.title.text = `Categories restocked on ${date}`
	} else {
		chart.value.data.datasets = [
			{
				data: categoryValues,
				backgroundColor: categoryLabels.map((c) => getCategoryColor(c)),
			},
		]
		chart.value.options.plugins.title.text = `Categories restocked in ${date}`
	}
	chart.value.update()
}

const showItemDrillDownView = (category: string) => {
	if (!chart.value) return

	const itemData = currentCategoryData.value?.items

	const entries = Object.entries(itemData).map(([label, value]) => ({
		label,
		value: value,
	}))

	if (sortByCount.value) {
		entries.sort((a, b) => a.value - b.value)
	}

	const itemLabels = entries.map((e) => e.label)
	const itemValues = entries.map((e) => e.value)

	chart.value.data.labels = itemLabels
	if (grouping.value === "Day" || grouping.value === "Week") {
		chart.value.data.datasets = [
			{
				data: itemValues,
				backgroundColor: getItemColor(category),
			},
		]
		chart.value.options.plugins.title.text = `${category} restocked on ${selectedTimeLevel.value}`
	} else {
		chart.value.data.datasets = [
			{
				data: itemValues,
				backgroundColor: getItemColor(category),
			},
		]
		chart.value.options.plugins.title.text = `${category} restocked in ${selectedTimeLevel.value}`
	}
	chart.value.update()
}

const resetChart = () => {
	if (!chart.value) return

	if (secondDrillDown.value) {
		secondDrillDown.value = false
		selectedCategory.value = null
		showCategoryDrillDownView(selectedTimeLevel.value!)
		return
	}

	firstDrillDown.value = false
	selectedTimeLevel.value = null

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.title = {
		display: true,
		text: "Item Donation Count",
		...titleOptions,
	}
	chart.value.update()
}

const formatLabel = (key: string) => {
	if (grouping.value === "Semester") {
		return key
	}

	if (grouping.value === "Week") {
		const [start, end] = key.split(" - ")

		return `${df.format(new Date(start))} - ${df.format(new Date(end))}`
	}

	if (grouping.value === "Month") {
		return `${dfMonth.format(new Date(key))}`
	}

	return df.format(new Date(key))
}

const displayRange = computed(() => {
	const { start, end } = modelValue.value

	if (!start || !end) return ""

	return `${start.month}/${start.day}/${start.year} - ${end.month}/${end.day}/${end.year}`
})

const titleOptions = {
	color: "#000000",
	font: {
		size: 30,
		weight: "bold",
	},
	padding: {
		top: 10,
		bottom: 40,
	},
}

onMounted(async () => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: [],
			datasets: [],
		},
		plugins: [topLabelPlugin],
		options: {
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					...titleOptions,
				},
			},
			responsive: true,
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, elements) {
				if (secondDrillDown.value) return
				if (!elements.length) return

				if (firstDrillDown.value) {
					const selectedCategoryName = chart.value.data.labels[elements[0].index]
					selectedCategory.value = selectedCategoryName
					secondDrillDown.value = true
					showItemDrillDownView(selectedCategoryName)
				} else {
					const selectedTime = overviewState.value.labels[elements[0].index]
					selectedTimeLevel.value = selectedTime
					firstDrillDown.value = true
					showCategoryDrillDownView(selectedTime)
				}
			},
		},
	})

	await updateChart()
})
</script>
