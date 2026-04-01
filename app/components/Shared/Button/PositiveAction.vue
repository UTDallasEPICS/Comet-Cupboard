<template>
	<UButton
		variant="solid"
		:ui="{
			base: 'bg-final-utd-green',
		}"
	>
		{{ props.text }}
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
})
</script>
