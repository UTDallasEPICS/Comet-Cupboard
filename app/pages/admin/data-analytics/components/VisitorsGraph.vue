<template>
    <div>
		<canvas ref="barContainer"></canvas>
	</div>
</template>

<script lang='ts' setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
import {ref} from 'vue'


</script>