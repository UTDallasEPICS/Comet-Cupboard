<template lang="pug">
div
	button(@click="temporaryArray.push(1)") Add
	ClientOnly
		PlotlyChart(v-for="i in temporaryArray" :data="data")
</template>

<script setup>
const temporaryArray = ref([0])

const data = [
	{
		x: ["giraffes", "orangutans", "monkeys"],
		y: [20, 14, 23],
		type: "bar",
	},
]
</script>
