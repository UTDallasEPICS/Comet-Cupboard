<template>
	<UButton
		variant="solid"
		:ui="{
			base: 'bg-final-negative-red',
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
