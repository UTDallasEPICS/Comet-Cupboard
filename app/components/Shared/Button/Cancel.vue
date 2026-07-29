<template>
	<UButton
		variant="solid"
		:ui="{
			base: `bg-${color} hover:bg-${color}/75 active:bg-${color}/75 disabled:bg-${color} aria-disabled:bg-${color} outline-${color}/25 rounded-3xl justify-center items-center w-32`,
			...props.ui,
		}"
	>
		{{ props.text }}
	</UButton>
</template>

<script setup lang="ts">
const color = "cancel-gray"

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
