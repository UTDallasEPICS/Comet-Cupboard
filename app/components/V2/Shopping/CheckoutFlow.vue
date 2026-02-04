<template>
	<!-- checkout flow layout -->
	<div class="relative flex items-center justify-center" :style="{ height: flowHeight + 'px', width: '322px' }">
		<div
			class="absolute border-t border-black"
			:style="{ left: '8%', right: '45%', top: '50%', transform: 'translateY(-50%)', height: lineThickness + 'px' }"
		></div>
		<div
			class="absolute border-t border-black"
			:style="{ left: '45%', right: '5%', top: '50%', transform: 'translateY(-50%)', height: lineThickness + 'px' }"
		></div>

		<div v-for="(color, index) in ellipseColors" :key="index" class="absolute rounded-full" :style="ellipseStyle(index, color)"></div>

		<!-- labels circles -->
		<span class="absolute text-black" style="left: 2%; top: -15%">Terms</span>
		<span class="absolute text-black" style="left: 39%; top: -15%">Pending</span>
		<span class="absolute text-black" style="left: 80%; top: -15%">Results</span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	flowHeight: { type: Number, default: 57 },
	ellipseColors: {
		type: Array,
		default: () => ["#B9B9B9", "#B9B9B9", "#B9B9B9"],
	},
	circleSize: { type: Number, default: 35 },
	lineThickness: { type: Number, default: 2 },
})

const circlePositions = ["10%", "50%", "90%"]

const ellipseStyle = (index, color) => ({
	width: props.circleSize + "px",
	height: props.circleSize + "px",
	backgroundColor: color,
	top: "50%",
	left: circlePositions[index],
	transform: "translate(-50%, -50%)",
})
</script>
