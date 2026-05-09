<template>
    <div>
		<div class="flex items-center justify-end">
			<USelect v-model="grouping" :items="['Day', 'Week', 'Month']" class="w-28" />

			<UPopover :content="{ align: 'center' }">
				<UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
				{{ label }}
				</UButton>

			<template #content>
				<div class="flex items-stretch divide-x divide-(--ui-border)">
					<div class="hidden sm:flex flex-col justify-center py-2">
					<UButton
						v-for="(range, index) in ranges"
						:key="index"
						:label="range.label"
						color="neutral"
						variant="ghost"
						class="rounded-none px-4"
						:class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
						truncate
						@click="selectRange(range)"
					/>
					</div>

					<UCalendar v-model="modelValue" class="p-2" :number-of-months="isDesktop ? 2 : 1" range />
				</div>
			</template>
		</UPopover>
	</div>
		<canvas ref="lineContainer"></canvas>
	</div>
</template>

<script lang='ts' setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { data: user } = await useFetch('/api/head-admin/data/visitor')

const chartContainer = useTemplateRef("lineContainer")

const chart = shallowRef(null)
	
const orders = computed(() => {
	return user.value.flatMap(user => 
		user.Orders.map(order => ({
			orderID: order.orderID,
			createdAt: order.createdAt,
			netID: user.netID,
		}))
	)
})

const df = new DateFormatter('en-US', { month: 'short', day: 'numeric' })
const dfMonth = new DateFormatter('en-US', {month: 'short'})
const tz = getLocalTimeZone()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual('sm')

const ranges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last year', years: 1 }
]

const initialEnd = today(tz)
const modelValue = shallowRef({
  start: initialEnd.subtract({ days: 14 }),
  end: initialEnd
})

const label = computed(() => {
  const { start, end } = modelValue.value
  if (!start) return 'Pick a date'
  if (!end) return df.format(start.toDate(tz))
  return `${df.format(start.toDate(tz))} - ${df.format(end.toDate(tz))}`
})

function computeStart(range: typeof ranges[number]) {
  const end = today(tz)
  return { start: end.subtract({ days: range.days, months: range.months, years: range.years }), end }
}

function isRangeSelected(range: typeof ranges[number]) {
  if (!modelValue.value?.start || !modelValue.value?.end) return false
  const { start, end } = computeStart(range)
  return modelValue.value.start.compare(start) === 0 && modelValue.value.end.compare(end) === 0
}

function selectRange(range: typeof ranges[number]) {
  modelValue.value = computeStart(range)
}

const filtered = computed(() => {
	const startDate = new Date(modelValue.value.start.toDate(tz))
	startDate.setHours(0, 0, 0)
	const endDate = new Date(modelValue.value.end.toDate(tz))
	endDate.setHours(23, 59, 59)


	return orders.value.filter(order => {
		const orderDate = new Date(order.createdAt)
		return (startDate <= orderDate && orderDate <= endDate)
	})
})

const grouping = ref('Day')

watch(modelValue, () => {
	const start = modelValue.value.start.toDate(tz)
	const end = modelValue.value.end.toDate(tz)
	const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 *24))

	if (diffDays <= 30) {
		grouping.value = 'Day'
	} else if (diffDays <= 90) {
		grouping.value = 'Week'
	} else {
		grouping.value = 'Month'
	}
})

const countedDates = computed(() => {
	const dateCount: Record<string, number> = {}

	for (const order of filtered.value){
		let dateKey = ''
		console.log(order)

		if (grouping.value === 'Day'){
			dateKey = order.createdAt.split("T")[0]

		}else if (grouping.value === 'Week'){
			const date = new Date(order.createdAt)
			date.setDate(date.getDate() - date.getDay())
			const startWeek = date.toISOString().split("T")[0]
			date.setDate(date.getDate() + 6)
			const endWeek = date.toISOString().split("T")[0]
			dateKey = `${startWeek} - ${endWeek}`

		}else if (grouping.value === 'Month'){
			dateKey = order.createdAt.split("-").slice(0,2).join("-")
		}

		if (!(dateKey in dateCount)){
			dateCount[dateKey] = 1
		} else if (dateKey in dateCount){
			dateCount[dateKey] += 1
		} else {
			dateCount[dateKey] = 0
		}
	}

	return dateCount
})

const formatLabel = (key: string) => {
	if (grouping.value === 'Week'){
		const [start, end] = key.split(" - ")
		return `${df.format(new Date(start))} - ${df.format(new Date(end))}`
	} else if (grouping.value === 'Month'){
		return `${dfMonth.format(new Date(key))}`
	}

	return df.format(new Date(key))
}

const chartPoints = computed(() => {
	const startDate = ''
	const endDate = ''

	return Object.keys(countedDates.value).sort().map(key => ({
		label: formatLabel(key),
		value: countedDates.value[key]
	}))
})

function wipeData(chart) {
	chart.data.labels = []
	chart.data.datasets[0].data = []
	chart.update()
}

function addData(chart, labels, data){
	chart.data.labels = labels
	chart.data.datasets[0].data = data
	chart.update()
}

watch(countedDates, () => {
	if (!chart.value) return
	wipeData(chart.value)
	addData(chart.value, chartPoints.value.map(p => p.label), chartPoints.value.map(p => p.value))
})

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: 'line',
		data: {
			labels: chartPoints.value.map(p => p.label),
			datasets: [{
				label: 'Visitors',
				data: chartPoints.value.map(p => p.value),
				borderColor: 'green'
			}]
		}
	})
})
</script>