<template>
	<div class="flex justify-center items-center relative w-[322px]" :style="{ height: flowHeight + 'px' }">
		<!-- lines -->
		<div
			class="absolute border-t border-black"
			:style="{ left: '8%', right: '45%', top: '50%', transform: 'translateY(-50%)', height: lineThickness + 'px' }"
		></div>
		<div
			class="absolute border-t border-black"
			:style="{ left: '45%', right: '5%', top: '50%', transform: 'translateY(-50%)', height: lineThickness + 'px' }"
		></div>

		<!-- ellipses -->
		<div
			v-for="(color, index) in ellipseColors"
			:key="index"
			class="absolute rounded-full"
			:style="{
				width: circleSize + 'px',
				height: circleSize + 'px',
				backgroundColor: color,
				top: '50%',
				left: circlePositions[index],
				transform: 'translate(-50%, -50%)',
			}"
		></div>

		<!-- labels -->
		<span class="absolute left-[3%] top-[-10%] text-[14px] text-black">Terms</span>
		<span class="absolute left-[41%] top-[-10%] text-[14px] text-black">Pending</span>
		<span class="absolute left-[82%] top-[-10%] text-[14px] text-black">Results</span>
	</div>
</template>

<script setup>
const props = defineProps({
	flowHeight: { type: Number, default: 57 }, // height
	ellipseColors: {
		type: Array,
		default: () => ["#B9B9B9", "#B9B9B9", "#B9B9B9"],
	},
	circleSize: { type: Number, default: 35 },
	lineThickness: { type: Number, default: 2 }, // thickness lines
})

const circlePositions = ["10%", "50%", "90%"] // horizontal positions for circles
</script>
