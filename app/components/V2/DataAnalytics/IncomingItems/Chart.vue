<template lang="pug">
div.h-full.w-full
	ClientOnly
		DataPlotlyChart(
			:config="{ scrollZoom: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'pan2d', 'select2d'], displayModeBar: true }"
			:data="processedData"
			:layout="layout"
		).h-full.w-full
</template>

<script lang="ts" setup>
enum TimeLevelType {
	Day = "Day",
	Week = "Week",
	Month = "Month",
	Semester = "Semester",
	Year = "Year",
}

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	timeLevel: {
		type: String as PropType<TimeLevelType>,
		required: false,
		default: "Day",
	},
	timeFilter: {
		type: Object,
		required: false,
		default: () => ({
			start: undefined,
			end: undefined,
		}),
	},
	showLegend: {
		type: Boolean,
		required: false,
		default: true,
	},
})

const { title, timeLevel, timeFilter, showLegend } = toRefs(props)

const { data: incomingItemsData } = await useFetch("/api/v2/data/incomingItems", {
	method: "GET",
	params: {
		timeLevel: timeLevel.value,
		startDate: timeFilter.value.start ? timeFilter.value.start.toISOString() : undefined,
		endDate: timeFilter.value.end ? timeFilter.value.end.toISOString() : undefined,
	},
})

const processedData = computed(() => {
	if (!incomingItemsData.value) {
		return []
	}

	const x = Object.keys(incomingItemsData.value)
	const y = Object.keys(incomingItemsData.value).map((timeBucket) => {
		// for now, just count total incoming items
		let bucketCount = 0
		Object.keys(incomingItemsData.value[timeBucket]).forEach((category) => {
			const itemsInCategory = incomingItemsData.value[timeBucket][category]
			const totalForCategory = Object.values(itemsInCategory).reduce((sum, val) => sum + val, 0)
			bucketCount += totalForCategory
		})
		return bucketCount
	})

	return [
		{
			x: x,
			y: y,
			type: "bar",
			hoverinfo: "x+y",
			text: y,
			name: "Incoming Items",
		},
	]
})

const layout = computed(() => {
	return {
		title: {
			text: title.value,
		},
		barmode: "stack",
		dragmode: "pan",
		xaxis: {
			linecolor: "black",
			linewidth: 2,
			mirror: true,
		},
		yaxis: {
			linecolor: "black",
			linewidth: 2,
			mirror: true,
			title: {
				text: "Count",
			},
		},
		plot_bgcolor: "#D9D9D9",
		hoverlabel: {
			bgcolor: "#FFFFFF",
		},
		margin: {
			l: 25,
			r: 25,
			t: 75,
			b: 100,
		},
		showlegend: showLegend.value,
	}
})
</script>
