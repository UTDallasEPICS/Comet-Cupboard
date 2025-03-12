<template lang="pug">
div(:id="plotElement")
</template>

<script lang="ts" setup>
import Plotly from "plotly.js-dist-min"
import { nanoid } from "nanoid"

const plotElement = ref<string>(nanoid())

const props = defineProps({
	data: {
		type: Array<any>,
		required: true,
	},
	layout: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
	config: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
})

const renderChart = () => {
	Plotly.newPlot(plotElement.value, props.data, props.layout)
}

onMounted(() => {
	renderChart()
})
</script>
