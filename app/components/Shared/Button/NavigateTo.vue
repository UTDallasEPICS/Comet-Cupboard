<template>
	<SharedButtonBaseCustomColor
		custom-color="utd-orange"
		content-color="white"
		:ui="{
			...props.ui,
		}"
	>
		{{ props.text }}
	</SharedButtonBaseCustomColor>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
	ui: {
		type: Object,
		default: () => ({}),
	},
})
</script>
