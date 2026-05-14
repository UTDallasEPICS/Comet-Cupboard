<template>
    <div>
		<div class="flex items-center justify-end">
			<div class="flex flex-col justify-center gap-1 mr-auto">
				<p class="text-sm">Visitor Type</p>
				<USelect v-model="type" :items="['Total', 'Unique']" class="w-28" />
			</div>

			<div class="flex flex-col justify-left gap-1 mr-2">
				<p class="text-sm text-right">Time Level</p>
				<USelect v-model="grouping" :items="['Day', 'Week', 'Month']" class="w-28" />
			</div>

			<div class="flex flex-col justify-center gap-1">
				<p class="text-sm text-right">Time Range</p>
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
			createdAt: new Date(order.createdAt),
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

const type = ref('Total')

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

	const currentDate = new Date(modelValue.value.start.toDate(tz))
	currentDate.setHours(0, 0, 0)

	const endDate = new Date(modelValue.value.end.toDate(tz))
	endDate.setHours(0, 0, 0)

	if (type.value === 'Total'){
		if (grouping.value === 'Day'){
			while (currentDate <= endDate){
				const dateKey = currentDate.toLocaleDateString('en-US')
				dateCount[dateKey] = 0
				
				currentDate.setDate(currentDate.getDate() + 1)
			}

			for (const order of filtered.value){
				const dateKey = new Date(order.createdAt).toLocaleDateString('en-US')

				if (dateKey in dateCount){
					dateCount[dateKey] += 1
				}
			}
		} else if (grouping.value === 'Week'){
			while (currentDate <= endDate) {
				const weekStart = new Date(currentDate)
				weekStart.setDate(weekStart.getDate() - weekStart.getDay())

				const weekEnd = new Date(weekStart)
				weekEnd.setDate(weekEnd.getDate() + 6)

				const dateKey = `${weekStart.toLocaleDateString('en-US')} - ${weekEnd.toLocaleDateString('en-US')}`

				dateCount[dateKey] = 0

				currentDate.setDate(currentDate.getDate() + 7)
			}

			for (const order of filtered.value){
				const weekStart = new Date(order.createdAt)
				weekStart.setDate(weekStart.getDate() - weekStart.getDay())

				const weekEnd = new Date(weekStart)
				weekEnd.setDate(weekEnd.getDate() + 6)

				const dateKey = `${weekStart.toLocaleDateString('en-US')} - ${weekEnd.toLocaleDateString('en-US')}`

				if (dateKey in dateCount){
					dateCount[dateKey] += 1
				}
			}
		} else if (grouping.value === 'Month') {
			while (currentDate <= endDate){
				const dateKey = currentDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})

				dateCount[dateKey] = 0

				currentDate.setMonth(currentDate.getMonth() + 1)
			}

			for (const order of filtered.value){
				const dateKey = new Date(order.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})

				if (dateKey in dateCount){
					dateCount[dateKey] += 1
				}
			}
		}
	}

	if (type.value === 'Unique'){
		const uniqueVisitors: Record<string, Set<string>> = {}

		if (grouping.value === 'Day'){
			while (currentDate <= endDate){
				const dateKey = currentDate.toLocaleDateString('en-US')
				dateCount[dateKey] = 0
				
				currentDate.setDate(currentDate.getDate() + 1)
			}

			for (const order of filtered.value){
				const dateKey = new Date(order.createdAt).toLocaleDateString('en-US')
				const orderID = order.netID

				if (!(dateKey in uniqueVisitors)){
					uniqueVisitors[dateKey] = new Set()
				}

				if (!(uniqueVisitors[dateKey]?.has(orderID))){
					dateCount[dateKey] += 1
					uniqueVisitors[dateKey]?.add(orderID)
				}
			}
		} else if (grouping.value === 'Week'){
			while (currentDate <= endDate) {
				const weekStart = new Date(currentDate)
				weekStart.setDate(weekStart.getDate() - weekStart.getDay())

				const weekEnd = new Date(weekStart)
				weekEnd.setDate(weekEnd.getDate() + 6)

				const dateKey = `${weekStart.toLocaleDateString('en-US')} - ${weekEnd.toLocaleDateString('en-US')}`

				dateCount[dateKey] = 0

				currentDate.setDate(currentDate.getDate() + 7)
			}

			for (const order of filtered.value){
				const weekStart = new Date(order.createdAt)
				weekStart.setDate(weekStart.getDate() - weekStart.getDay())

				const weekEnd = new Date(weekStart)
				weekEnd.setDate(weekEnd.getDate() + 6)

				const dateKey = `${weekStart.toLocaleDateString('en-US')} - ${weekEnd.toLocaleDateString('en-US')}`

				const orderID = order.netID

				if (!(dateKey in uniqueVisitors)){
					uniqueVisitors[dateKey] = new Set()
				}

				if (!(uniqueVisitors[dateKey]?.has(orderID))){
					dateCount[dateKey] += 1
					uniqueVisitors[dateKey]?.add(orderID)
				}
			}
		} else if (grouping.value === 'Month') {
			while (currentDate <= endDate){
				const dateKey = currentDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})

				dateCount[dateKey] = 0

				currentDate.setMonth(currentDate.getMonth() + 1)
			}

			for (const order of filtered.value){
				const dateKey = new Date(order.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})

				const orderID = order.netID

				if (!(dateKey in uniqueVisitors)){
					uniqueVisitors[dateKey] = new Set()
				}

				if (!(uniqueVisitors[dateKey]?.has(orderID))){
					dateCount[dateKey] += 1
					uniqueVisitors[dateKey]?.add(orderID)
				}
			}
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
	return Object.keys(countedDates.value).map(key => ({
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